class CovidPackage extends GrokPackage {

    //tags: app
    //name: Enamine Store
    startApp(context) {
        let emptyTable = DataFrame.create();
        let view = grok.addTableView(emptyTable);
        view.name = 'Covid-19';
        view.basePath = '';
        view.root.className = 'grok-view grok-table-view';

        grok.query('Covid:CasesByCountries', {}).then((products) => {
            var customersView = null;
        grok.addTableView(products);
    });

    }



}
