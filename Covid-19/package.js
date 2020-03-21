class CovidPackage extends GrokPackage {

    //tags: app
    //name: Covid-19 Current Situation
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
                view.dataFrame = data !== null ?  CovidPackage.dataToTable(data, 'enaminestore') : emptyTable;
                ui.setUpdateIndicator(view.root, false);
            });
        }
        update();
/*
        molecule.onChanged(() => update());
        searchMode.onChanged(() => {
            similarity.enabled = searchMode.value === 'Similar';
            update();
        });
        currency.onChanged(() => update());
        similarity.onChanged(() => update());
        catalog.onChanged(() => update());

        let acc = view.toolboxPage.accordion;
        acc.addPane('Enamine Store', () => filtersHost, true, acc.panes[0]);
    }

    //name: Enamine Store
    //description: Enamine Store Samples
    //tags: panel, widgets
    //input: string smiles {semType: Molecule}
    //output: widget result
    //condition: true
    enamineStore(smiles) {
        let panels = ui.div([
            this.createSearchPanel('Exact', smiles),
            this.createSearchPanel('Similar', smiles),
            this.createSearchPanel('Substructure', smiles)
        ]);
        return new Widget(panels);
    }

    //description: Creates search panel
    createSearchPanel(panelName, smiles) {
        const currency = 'USD';
        let headerHost = ui.divH([ui.h2(panelName)], 'enamine-store-panel-header');
        let compsHost = ui.divH([ui.loader()]);
        let panel = ui.divV([headerHost, compsHost], 'enamine-store-panel');
        grok.callQuery('EnamineStore:Search', {
            'code': `search_${smiles}_${EnamineStorePackage.searchModeToCommand(panelName)}`,
            'currency': currency
        }, true, 100).then(fc => {
            compsHost.removeChild(compsHost.firstChild);
            let data = JSON.parse(fc.getParamValue('stringResult'))['data'];
            if (data === null) {
                compsHost.appendChild(ui.divText('No matches'));
                return;
            }
            for (let comp of data) {
                let smiles = comp['smile'];
                let mol = ui.svgMol(smiles, 150, 75);
                let id = comp['Id'];
                let props = {
                    'ID': id,
                    'Formula': comp['formula'],
                    'MW': comp['mw'],
                    'Availability': comp['availability'],
                    'Delivery': comp['deliveryDays']
                };
                for (let pack of comp['packs'])
                    props[`${pack['amount']} ${pack['measure']}`] = `${pack['price']} ${currency}`;
                ui.tooltip(mol, ui.divV([ui.tableFromMap(props), ui.divText('Click to open in the store.')]));
                mol.addEventListener('click', function() {
                    window.open(comp['productUrl'], '_blank');
                });
                compsHost.appendChild(mol);
            }
            headerHost.appendChild(ui.iconFA('arrow-square-down', () =>
                grok.addTableView(EnamineStorePackage.dataToTable(data, `EnamineStore ${panelName}`)), 'Open compounds as table'));
            compsHost.style.overflowY = 'auto';
        }).catch(err => {
            compsHost.removeChild(compsHost.firstChild);
            let div = ui.divText('No matches');
            ui.tooltip(div, `${err}`);
            compsHost.appendChild(div);
        });
        return panel;
    }

    // description: Converts JSON data into DataFrame
    static dataToTable(data, name) {
        let columns = [
            Column.fromStrings('smiles', data.map(comp => comp['smile'])),
            Column.fromStrings('ID', data.map(comp => comp['Id'])),
            Column.fromStrings('Formula', data.map(comp => comp['formula'])),
            Column.fromFloat32Array('MW', new Float32Array(data.map(comp => comp['mw']))),
            Column.fromInt32Array('Availability', new Int32Array(data.map(comp => comp['availability']))),
            Column.fromStrings('Delivery', data.map(comp => comp['deliveryDays']))
        ];
        let currency = null;
        let packsArrays = new Map();
        for (let n = 0; n < data.length; n++) {
            let packs = data[n]['packs'];
            for (let m = 0; m < packs.length; m++) {
                let pack = packs[m];
                let name = `${pack['amount']} ${pack['measure']}`;
                if (!packsArrays.has(name))
                    packsArrays.set(name, new Float32Array(data.length));
                packsArrays.get(name)[n] = pack['price'];
                if (currency === null && pack['currencyName'] !== null)
                    currency = pack['currencyName'];
            }
        }
        for (let name of packsArrays.keys()) {
            let column = Column.fromFloat32Array(name, packsArrays.get(name));
            column.semType = 'Money';
            column.setTag('format', `money(${currency === 'USD' ? '$' : '€'})`);
            columns.push(column);
        }
        let table = DataFrame.fromColumns(columns);
        table.name = name;
        return table;
    }

    //description: Converts search mode friendly name to command
    static searchModeToCommand(name) {
        const dict = {'Exact': 'exact', 'Similar': 'sim', 'Substructure': 'sub'};
        return dict[name];
    }
}
*/