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
  applicantOneIncome?: string;
  applicantTwoIncome?: string;
  totalIncome?: number;

  // Pre-set
  maxIncomeLimit: number;

  /**
   * Step 2
   */
  selectedState: string | '';
  selectedLocation: string | '';
  homeType: 'established' | 'new';
  expectedPurchasePrice?: string;
  userContribution?: string;

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
  /**
   * Reacts on changes to state/location, loan type, purchase price, user contribution
   */
  onHomeDetailsChange(): void;
  runDTITest(): void;
  calculateEligibility(): void;
  parseNumber(value: string | number): number;
  moneyFormat(value: number | undefined): string;
}

window.addEventListener('alpine:init', () => {
  const MAX_INCOME = {
    single: 100000,
    joint: 160000,
  };

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

      maxIncomeLimit: MAX_INCOME.single,

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
        if (!state?.locations) {
          this.selectedLocation = '';
        }
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

        this.$watch('applicantType, isSingleParent, applicantOneIncome, applicantTwoIncome', () => {
          this.totalIncome =
            this.parseNumber(this.applicantOneIncome || 0) +
            this.parseNumber(this.applicantTwoIncome || 0);

          this.maxIncomeLimit =
            this.applicantType === 'single' && !this.isSingleParent
              ? MAX_INCOME.single
              : MAX_INCOME.joint;

          this.eligibilityMissCount.incomeCap = this.totalIncome <= this.maxIncomeLimit ? 0 : 1;

          this.runDTITest();
        });

        this.$watch('selectedState', () => {
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

        const expectedPurchasePrice = this.parseNumber(this.expectedPurchasePrice);
        const userContribution = this.parseNumber(this.userContribution);

        this.maxGovContribution =
          this.homeType === 'new' ? expectedPurchasePrice * 0.4 : expectedPurchasePrice * 0.3;

        this.personalLoanAmount = Math.max(
          expectedPurchasePrice - userContribution - this.maxGovContribution,
          0
        );

        this.eligibilityMissCount.priceCap = expectedPurchasePrice <= priceCap ? 0 : 1;
        // minimum 2% of the expected purchase price
        this.eligibilityMissCount.depositTest =
          userContribution >= expectedPurchasePrice * 0.02 ? 0 : 1;

        this.runDTITest();
      },

      runDTITest() {
        if (!this.personalLoanAmount || !this.totalIncome || this.personalLoanAmount <= 0) {
          this.eligibilityMissCount.dtiTest = 1;
          return;
        }
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

      moneyFormat(value: number | undefined) {
        if (value === undefined) return '';
        return value.toLocaleString('en-AU', {
          style: 'currency',
          currency: 'AUD',
          maximumFractionDigits: 0,
        });
      },

      /**
       * Converts a number string with commas to a number datatype
       * @param value - String with commas, e.g., "1,000,000"
       * @returns Number without commas, e.g., 1000000
       */
      parseNumber(value: string): number {
        if (!value) return 0;
        const cleanedValue = value.replace(/,/g, '');
        const parsed = parseFloat(cleanedValue);
        return isNaN(parsed) ? 0 : parsed;
      },
    } as AlpineComponent<FormComponent>;
  });
});
