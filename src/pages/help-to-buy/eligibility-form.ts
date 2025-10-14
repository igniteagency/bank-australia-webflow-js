import type { AlpineComponent } from 'alpinejs';

import { STATES_PRICES_LIST } from './states-price-list';

interface EligibilityMissCounter {
  initialCriteria: number;
  incomeCap: number;
  priceCap: number;
  canManageLoan: number;
  haveEnoughFunds: number;
}

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
  eligible: boolean;

  /**
   * Step 1
   */
  initialCriteriaMet: boolean;
  applicantType: 'single' | 'joint';
  isSingleParent: boolean;
  applicantOneIncome: number;
  applicantTwoIncome: number | undefined;

  minIncomeRequired: MinParentIncomeRequirement;

  /**
   * Step 2
   */
  selectedState: string | '';
  selectedLocation: string | '';
  homeType: 'established' | 'new';
  expectedPurchasePrice: number;
  userContribution: number;

  // Derived
  priceCap: number;
  maxGovContribution: number;
  personalLoanAmount: number;

  /**
   * Step 3
   */
  canManageLoan: boolean;
  haveEnoughFunds: boolean;

  get statesPricesList(): typeof STATES_PRICES_LIST;
  get locationsList(): { name: string; price: number }[] | '';
  /**
   * Sets watchers on all reactive properties to determine eligibility
   */
  init(): void;
  /**
   * Reacts on changes to state/location, loan type, purchase price, user contribution
   */
  onHomeDetailsChange(): void;
  calculateEligibility(): void;
}

window.addEventListener('alpine:init', () => {
  window.Alpine.data('helpToBuySchemeForm', function () {
    return {
      eligibilityMissCount: {
        initialCriteria: 0,
        incomeCap: 0,
        priceCap: 0,
        canManageLoan: 0,
        haveEnoughFunds: 0,
      },
      eligible: false,

      minIncomeRequired: {
        single: 100000,
        joint: 160000,
      },

      initialCriteriaMet: false,
      applicantType: 'single',
      isSingleParent: false,
      applicantOneIncome: 0,
      applicantTwoIncome: undefined,

      selectedState: '',
      selectedLocation: '',
      homeType: 'established',
      expectedPurchasePrice: 0,
      userContribution: 0,

      priceCap: 0,
      maxGovContribution: 0,
      personalLoanAmount: 0,

      canManageLoan: false,
      haveEnoughFunds: false,

      get statesPricesList() {
        return STATES_PRICES_LIST;
      },

      get locationsList() {
        const state = this.statesPricesList.find((s) => s.state === this.selectedState);
        return state ? state.locations : '';
      },

      init() {
        this.$watch('eligibilityMissCount', () => this.calculateEligibility());
        this.calculateEligibility();

        this.$watch('initialCriteriaMet', (value: boolean) => {
          this.eligibilityMissCount.initialCriteria = value ? 0 : 1;
        });

        this.$watch('applicantType', (value: 'single' | 'joint') => {
          if (value === 'single') {
            this.applicantTwoIncome = undefined;
          }
          this.eligibilityMissCount.incomeCap = 0; // reset
        });

        this.$watch(
          'applicantOneIncome, applicantTwoIncome',
          ([incomeOne, incomeTwo]: [number, number | undefined]) => {
            const totalIncome = incomeOne + (incomeTwo || 0);
            const requiredIncome =
              this.applicantType === 'single'
                ? this.minIncomeRequired.single
                : this.minIncomeRequired.joint;

            this.eligibilityMissCount.incomeCap = totalIncome >= requiredIncome ? 0 : 1;
          }
        );

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

      onHomeDetailsChange() {
        const state = this.statesPricesList.find((s) => s.state === this.selectedState);
        if (!state) {
          this.priceCap = 0;
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
          priceCap = state.price || 0;
        }

        this.priceCap = priceCap;
        this.maxGovContribution =
          this.homeType === 'new'
            ? Math.min(this.expectedPurchasePrice * 0.2, 50000, priceCap * 0.2)
            : Math.min(this.expectedPurchasePrice * 0.1, 25000, priceCap * 0.1);
        this.personalLoanAmount = Math.max(
          this.expectedPurchasePrice - this.userContribution - this.maxGovContribution,
          0
        );

        this.eligibilityMissCount.priceCap =
          this.expectedPurchasePrice > 0 && this.expectedPurchasePrice <= priceCap ? 0 : 1;
      },

      calculateEligibility() {
        const totalMissCount = Object.values(this.eligibilityMissCount).reduce((a, b) => a + b, 0);
        this.eligible = totalMissCount > 0 ? false : true;
      },
    } as AlpineComponent<FormComponent>;
  });
});
