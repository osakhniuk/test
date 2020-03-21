class CovidPackage extends GrokPackage {

    //tags: app
    //name: Covid-19
    startApp(context) {

        let emptyTable = DataFrame.create();
        let view = grok.addTableView(emptyTable);
        view.name = 'Covid-19';
        view.basePath = '';
        view.root.className = 'grok-view grok-table-view';

        function update() {
            ui.setUpdateIndicator(view.root, true);
            grok.callQuery('Covid:CasesByCountries()', true, 100).then(fc => {
                let data = JSON.parse(fc.getParamValue('stringResult'))['data'];
                view.dataFrame = data !== null ?  CovidPackage.dataToTable(data, 'covid') : emptyTable;
                ui.setUpdateIndicator(view.root, false);
            });
        }
        update();
