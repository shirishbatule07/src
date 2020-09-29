export function ConfigurationReducer(state: any, action: any) {
  const configuration = {
    app: {
      secondaryLanguage: 'Arabic',
      isSecondaryLanguageDirectionRTL: true,
      secondaryLanguagePlaceHolder: 'أدخل الاسم باللغة العربية',
      baseCurrency: { label: "Kuwaiti Dinar", value: 1, noOfDecimals: 3, code: 'KD', exchangeRate: 1 },
    },
    user: {
      companyId: 1,
      enableFreeQty: true
    }
  }

  switch (action.type.toLowerCase()) {
    case 'add-configuration':
      return (state = action.payload);
    default:
      return (state = configuration);
  }
}
