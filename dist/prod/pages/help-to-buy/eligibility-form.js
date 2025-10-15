if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/help-to-buy/eligibility-form.js');
} else {
  (() => {
  // src/pages/help-to-buy/states-price-list.ts
  var STATES_LIST_WITH_PRICES = [
    {
      name: "New South Wales",
      locations: [
        { name: "Sydney", price: 13e5 },
        { name: "Newcastle and Lake Macquarie", price: 13e5 },
        { name: "Illawarra", price: 13e5 },
        { name: "Central Coast", price: 13e5 },
        { name: "Mid-North Coast", price: 13e5 },
        { name: "Coffs Harbour-Grafton", price: 13e5 },
        { name: "Richmond-Tweed", price: 13e5 },
        { name: "Other areas", price: 8e5 }
      ]
    },
    {
      name: "Victoria",
      locations: [
        { name: "Melbourne", price: 95e4 },
        { name: "Geelong", price: 95e4 },
        { name: "Other areas", price: 65e4 }
      ]
    },
    {
      name: "Queensland",
      locations: [
        { name: "Brisbane", price: 1e6 },
        { name: "Gold Coast", price: 1e6 },
        { name: "Sunshine Coast", price: 1e6 },
        { name: "Other areas", price: 7e5 }
      ]
    },
    // {
    //   name: 'South Australia',
    //   locations: [
    //     { name: 'Adelaide', price: 900000 },
    //     { name: 'Other areas', price: 500000 },
    //   ],
    // },
    // {
    //   name: 'Western Australia',
    //   locations: [
    //     { name: 'Perth', price: 850000 },
    //     { name: 'Other areas', price: 600000 },
    //   ],
    // },
    // {
    //   name: 'Tasmania',
    //   locations: [
    //     { name: 'Hobart', price: 700000 },
    //     { name: 'Other areas', price: 550000 },
    //   ],
    // },
    {
      name: "Northern Territory",
      price: 6e5
    },
    {
      name: "Australian Capital Territory",
      price: 1e6
    },
    {
      name: "Jervis Bay Territory and Norfolk Island",
      price: 55e4
    },
    {
      name: "Christmas Island and Cocos (Keeling) Islands",
      price: 4e5
    }
  ];

  // src/pages/help-to-buy/eligibility-form.ts
  window.addEventListener("alpine:init", () => {
    const MAX_INCOME = {
      single: 1e5,
      joint: 16e4
    };
    window.Alpine.data("helpToBuyEligibilityForm", function() {
      return {
        eligibilityMissCount: {
          initialCriteria: void 0,
          incomeCap: void 0,
          priceCap: void 0,
          depositTest: void 0,
          dtiTest: void 0,
          canManageLoan: void 0,
          haveEnoughFunds: void 0
        },
        eligible: false,
        showEligibilityVerdict: false,
        maxIncomeLimit: MAX_INCOME.single,
        initialCriteriaMet: void 0,
        applicantType: void 0,
        isSingleParent: void 0,
        applicantOneIncome: void 0,
        applicantTwoIncome: void 0,
        totalIncome: void 0,
        selectedState: "",
        selectedLocation: "",
        homeType: "established",
        expectedPurchasePrice: void 0,
        userContribution: void 0,
        priceCap: void 0,
        maxGovContribution: void 0,
        personalLoanAmount: void 0,
        canManageLoan: void 0,
        haveEnoughFunds: void 0,
        get statesList() {
          return STATES_LIST_WITH_PRICES;
        },
        get currentLocationsList() {
          const state = this.selectedStateObj;
          if (!state?.locations) {
            this.selectedLocation = "";
          }
          return state?.locations || "";
        },
        get selectedStateObj() {
          return this.statesList.find((s) => s.name === this.selectedState);
        },
        init() {
          this.$watch("eligibilityMissCount", () => this.calculateEligibility());
          this.calculateEligibility();
          this.$watch("initialCriteriaMet", (value) => {
            this.eligibilityMissCount.initialCriteria = value ? 0 : 1;
          });
          this.$watch("applicantType", (value) => {
            if (value === "single") {
              this.applicantTwoIncome = void 0;
            }
          });
          this.$watch("applicantType, isSingleParent, applicantOneIncome, applicantTwoIncome", () => {
            this.totalIncome = this.parseNumber(this.applicantOneIncome || 0) + this.parseNumber(this.applicantTwoIncome || 0);
            this.maxIncomeLimit = this.applicantType === "single" && !this.isSingleParent ? MAX_INCOME.single : MAX_INCOME.joint;
            this.eligibilityMissCount.incomeCap = this.totalIncome <= this.maxIncomeLimit ? 0 : 1;
          });
          this.$watch("selectedState", () => {
            this.selectedLocation = "";
          });
          this.$watch(
            "selectedState, selectedLocation, homeType, expectedPurchasePrice, userContribution",
            () => this.onHomeDetailsChange()
          );
          this.$watch("canManageLoan", (value) => {
            this.eligibilityMissCount.canManageLoan = value ? 0 : 1;
          });
          this.$watch("haveEnoughFunds", (value) => {
            this.eligibilityMissCount.haveEnoughFunds = value ? 0 : 1;
          });
        },
        onHomeDetailsChange() {
          const state = this.selectedStateObj;
          if (!state) {
            this.priceCap = void 0;
            this.maxGovContribution = 0;
            this.personalLoanAmount = 0;
            this.eligibilityMissCount.priceCap = 1;
            return;
          }
          let priceCap = 0;
          if ("locations" in state && state.locations) {
            const location = state.locations.find((l) => l.name === this.selectedLocation);
            priceCap = location ? location.price : 0;
          } else if ("price" in state) {
            this.selectedLocation = "";
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
          this.maxGovContribution = this.homeType === "new" ? expectedPurchasePrice * 0.4 : expectedPurchasePrice * 0.3;
          this.personalLoanAmount = Math.max(
            expectedPurchasePrice - userContribution - this.maxGovContribution,
            0
          );
          this.eligibilityMissCount.priceCap = expectedPurchasePrice <= priceCap ? 0 : 1;
          this.eligibilityMissCount.depositTest = userContribution >= expectedPurchasePrice * 0.02 ? 0 : 1;
          this.eligibilityMissCount.dtiTest = this.personalLoanAmount / (this.totalIncome || 1) <= 6 ? 0 : 1;
        },
        calculateEligibility() {
          const allValues = Object.values(this.eligibilityMissCount);
          if (allValues.some((v) => v === void 0)) {
            this.showEligibilityVerdict = false;
            this.eligible = false;
            return;
          }
          this.showEligibilityVerdict = true;
          const totalMissCount = allValues.reduce((a, b) => a + b, 0);
          this.eligible = totalMissCount > 0 ? false : true;
        },
        moneyFormat(value) {
          if (value === void 0) return "";
          return value.toLocaleString("en-AU", {
            style: "currency",
            currency: "AUD",
            maximumFractionDigits: 0
          });
        },
        /**
         * Converts a number string with commas to a number datatype
         * @param value - String with commas, e.g., "1,000,000"
         * @returns Number without commas, e.g., 1000000
         */
        parseNumber(value) {
          if (!value) return 0;
          const cleanedValue = value.replace(/,/g, "");
          const parsed = parseFloat(cleanedValue);
          return isNaN(parsed) ? 0 : parsed;
        }
      };
    });
  });
})();
}