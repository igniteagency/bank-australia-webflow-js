if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/pages/help-to-buy/states-price-list.js');
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
})();
}