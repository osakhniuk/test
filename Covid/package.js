class CovidPackage extends GrokPackage {

    //tags: app
    //name: Covid19
    startApp(context) {
        grok.query('Covid:CasesByCountries', {}).then((products) => {
            var customersView = null;
        grok.addTableView(products);
    });


    }
}

