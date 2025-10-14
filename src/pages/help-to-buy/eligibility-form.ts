import type { AlpineComponent } from 'alpinejs';

import { STATES_LIST_WITH_PRICES } from './states-price-list';

interface EligibilityMissCounter {
  initialCriteria?: number;
  incomeCap?: number;
  priceCap?: number;
  depositTest?: number;
  /**
   * Loan to Annual Income comparison
   */
  dtiTest?: number;
  canManageLoan?: number;
  haveEnoughFunds?: number;
}

type ApplicantType = 'single' | 'joint' | undefined;

interface MinParentIncomeRequirement {
  single: number;
  joint: number;
}

interface FormComponent {
  // Derived calcs
  /**
   * Tracks how many eligibility criteria are not met.
   * It's a reverse counter. So, if all criteria are met, the total of all counts is 0, otherwise, more than 1
   * This helps concretely determine if the user is eligible or not
   */
  eligibilityMissCount: EligibilityMissCounter;
  showEligibilityVerdict: boolean;
  eligible: boolean;

  /**
   * Step 1
   */
  initialCriteriaMet?: boolean;
  applicantType: ApplicantType;
  isSingleParent?: boolean;
  applicantOneIncome?: number;
  applicantTwoIncome?: number;
  totalIncome?: number;

  // Pre-set
  minIncomeRequired: MinParentIncomeRequirement;

  /**
   * Step 2
   */
  selectedState: string | '';
  selectedLocation: string | '';
  homeType: 'established' | 'new';
  expectedPurchasePrice?: number;
  userContribution?: number;

  // Derived
  priceCap?: number;
  maxGovContribution?: number;
  personalLoanAmount?: number;

  /**
   * Step 3
   */
  canManageLoan?: boolean;
  haveEnoughFunds?: boolean;

  get statesList(): typeof STATES_LIST_WITH_PRICES;
  get currentLocationsList(): { name: string; price: number }[] | '';
  get selectedStateObj(): (typeof STATES_LIST_WITH_PRICES)[0] | undefined;
  /**
   * Sets watchers on all reactive properties to determine eligibility
   */
  init(): void;
  updateIncomeEligibility(): void;
  /**
   * Reacts on changes to state/location, loan type, purchase price, user contribution
   */
  onHomeDetailsChange(): void;
  calculateEligibility(): void;
}

window.addEventListener('alpine:init', () => {
  window.Alpine.data('helpToBuyEligibilityForm', function () {
    return {
      eligibilityMissCount: {
        initialCriteria: undefined,
        incomeCap: undefined,
        priceCap: undefined,
        depositTest: undefined,
        dtiTest: undefined,
        canManageLoan: undefined,
        haveEnoughFunds: undefined,
      },
      eligible: false,
      showEligibilityVerdict: false,

      minIncomeRequired: {
        single: 100000,
        joint: 160000,
      },

      initialCriteriaMet: undefined,
      applicantType: undefined,
      isSingleParent: undefined,
      applicantOneIncome: undefined,
      applicantTwoIncome: undefined,
      totalIncome: undefined,

      selectedState: '',
      selectedLocation: '',
      homeType: 'established',
      expectedPurchasePrice: undefined,
      userContribution: undefined,

      priceCap: undefined,
      maxGovContribution: undefined,
      personalLoanAmount: undefined,

      canManageLoan: undefined,
      haveEnoughFunds: undefined,

      get statesList() {
        return STATES_LIST_WITH_PRICES;
      },

      get currentLocationsList() {
        const state = this.selectedStateObj;
        return state?.locations || '';
      },

      get selectedStateObj() {
        return this.statesList.find((s) => s.name === this.selectedState);
      },

      init() {
        this.$watch('eligibilityMissCount', () => this.calculateEligibility());
        this.calculateEligibility();

        this.$watch('initialCriteriaMet', (value: boolean) => {
          this.eligibilityMissCount.initialCriteria = value ? 0 : 1;
        });

        this.$watch('applicantType', (value: ApplicantType) => {
          if (value === 'single') {
            this.applicantTwoIncome = undefined;
          }
        });

        this.$watch('applicantType, isSingleParent, applicantOneIncome, applicantTwoIncome', () =>
          this.updateIncomeEligibility()
        );

        this.$watch('selectedState', (value: string) => {
          this.selectedLocation = '';
        });

        this.$watch(
          'selectedState, selectedLocation, homeType, expectedPurchasePrice, userContribution',
          () => this.onHomeDetailsChange()
        );

        this.$watch('canManageLoan', (value: boolean) => {
          this.eligibilityMissCount.canManageLoan = value ? 0 : 1;
        });

        this.$watch('haveEnoughFunds', (value: boolean) => {
          this.eligibilityMissCount.haveEnoughFunds = value ? 0 : 1;
        });
      },

      updateIncomeEligibility() {
        this.totalIncome = (this.applicantOneIncome || 0) + (this.applicantTwoIncome || 0);
        const maxIncomeCap =
          this.applicantType === 'single' && !this.isSingleParent
            ? this.minIncomeRequired.single
            : this.minIncomeRequired.joint;

        this.eligibilityMissCount.incomeCap = this.totalIncome <= maxIncomeCap ? 0 : 1;
      },

      onHomeDetailsChange() {
        const state = this.selectedStateObj;
        if (!state) {
          this.priceCap = undefined;
          this.maxGovContribution = 0;
          this.personalLoanAmount = 0;
          this.eligibilityMissCount.priceCap = 1;
          return;
        }

        let priceCap = 0;
        if ('locations' in state && state.locations) {
          const location = state.locations.find((l) => l.name === this.selectedLocation);
          priceCap = location ? location.price : 0;
        } else if ('price' in state) {
          this.selectedLocation = '';
          priceCap = state.price || 0;
        }

        this.priceCap = priceCap;

        if (!this.expectedPurchasePrice || !this.userContribution) {
          this.maxGovContribution = 0;
          this.personalLoanAmount = 0;
          this.eligibilityMissCount.priceCap = 1;
          this.eligibilityMissCount.depositTest = 1;
          this.eligibilityMissCount.dtiTest = 1;
          return;
        }

        this.maxGovContribution =
          this.homeType === 'new'
            ? this.expectedPurchasePrice * 0.4
            : this.expectedPurchasePrice * 0.3;

        this.personalLoanAmount = Math.max(
          this.expectedPurchasePrice - this.userContribution - this.maxGovContribution,
          0
        );

        this.eligibilityMissCount.priceCap = this.expectedPurchasePrice <= priceCap ? 0 : 1;
        // minimum 2% of the price cap
        this.eligibilityMissCount.depositTest =
          this.userContribution > this.priceCap * 0.02 ? 0 : 1;
        this.eligibilityMissCount.dtiTest =
          this.personalLoanAmount / (this.totalIncome || 1) <= 6 ? 0 : 1;
      },

      calculateEligibility() {
        const allValues = Object.values(this.eligibilityMissCount);
        if (allValues.some((v) => v === undefined)) {
          this.showEligibilityVerdict = false;
          this.eligible = false;
          return;
        }

        this.showEligibilityVerdict = true;
        const totalMissCount = allValues.reduce((a, b) => a + b, 0);
        this.eligible = totalMissCount > 0 ? false : true;
      },
    } as AlpineComponent<FormComponent>;
  });
});
