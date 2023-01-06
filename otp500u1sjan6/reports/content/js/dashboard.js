/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.0, "KoPercent": 2.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [3.181818181818182E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.007, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11000, 220, 2.0, 54715.92345454546, 717, 242657, 29643.0, 163813.09999999998, 183549.99999999997, 194283.68, 10.795967019302207, 80.23656712570383, 2.896911427187582], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 500, 0, 0.0, 95144.46199999996, 4579, 192611, 94268.0, 171006.8, 182250.8, 191106.8, 1.894061360011819, 0.38103187515862763, 0.4809140171905009], "isController": false}, {"data": ["test-state", 500, 0, 0.0, 20444.262000000006, 717, 39143, 20623.5, 35940.00000000001, 37448.85, 38925.96, 11.848622005260788, 3.5869851773738715, 3.170432060001422], "isController": false}, {"data": ["getTestState", 500, 0, 0.0, 15818.583999999999, 6058, 84386, 15143.5, 23464.3, 24377.95, 44891.73000000017, 4.798971100596033, 1.1622508134256015, 1.227861746441563], "isController": false}, {"data": ["getQuestionWiseAnalysis", 500, 0, 0.0, 21760.95999999999, 4026, 39557, 21724.0, 36247.200000000004, 37874.55, 39139.73, 8.810262193402876, 210.8698399395616, 2.3316221234493937], "isController": false}, {"data": ["sub-user-1", 500, 0, 0.0, 95486.30999999995, 4996, 185846, 95078.5, 168323.7, 176834.25, 184642.77, 1.9072613253177497, 96.30738412910632, 0.4861281307694655], "isController": false}, {"data": ["Send OTP Result", 500, 0, 0.0, 149688.9680000001, 112023, 175777, 149212.0, 170009.30000000002, 172894.7, 174990.27, 1.6524992398503495, 0.40689243489979243, 0.3856907405510093], "isController": false}, {"data": ["extras", 500, 0, 0.0, 20602.528000000013, 2989, 36809, 20850.0, 33700.6, 35346.25, 36540.58, 10.462220920256952, 12.056074888577347, 2.6257722426816765], "isController": false}, {"data": ["Result Login Validation", 500, 0, 0.0, 91153.15000000002, 2052, 175714, 90433.0, 158448.4, 167458.15, 173939.18, 2.695955527517618, 0.7477064158349644, 0.6555594983905145], "isController": false}, {"data": ["testLeaderboard", 500, 0, 0.0, 36658.58000000001, 30111, 37342, 36698.0, 37164.0, 37226.9, 37320.0, 5.831583858175881, 38.38366719150922, 1.5262348378819688], "isController": false}, {"data": ["menu", 500, 0, 0.0, 11092.410000000007, 9087, 20677, 10898.5, 12810.9, 13090.0, 15669.44000000002, 13.771828347931471, 7.289385707596541, 3.4429570869828683], "isController": false}, {"data": ["Submit OTP Result", 500, 220, 44.0, 163594.34800000014, 125641, 194562, 164691.5, 187908.5, 191283.75, 193707.85, 1.301500369626105, 0.45999903688972643, 0.3279170853159522], "isController": false}, {"data": ["userProfile", 500, 0, 0.0, 105422.45800000001, 22259, 184756, 106600.0, 169020.0, 177500.94999999998, 183423.85, 2.3427213988858018, 3.113714671761305, 0.5925437913197487], "isController": false}, {"data": ["referral_page", 500, 0, 0.0, 10640.117999999993, 9108, 19612, 10602.5, 11947.6, 12137.75, 12267.9, 14.188824881523312, 244.99278586934932, 3.671912689066092], "isController": false}, {"data": ["get-priority", 500, 0, 0.0, 19215.446, 6202, 32312, 19178.0, 29892.100000000002, 31201.05, 32179.84, 10.059552551102527, 4.509115840777402, 2.6720686463866086], "isController": false}, {"data": ["sub-user", 500, 0, 0.0, 190631.47800000012, 162112, 242657, 189314.0, 201828.4, 213065.35, 235794.93, 1.1525411226672568, 58.42955791115752, 0.5864003172945711], "isController": false}, {"data": ["updateModal", 500, 0, 0.0, 23076.857999999982, 12428, 32191, 23189.0, 30602.9, 31478.9, 32078.88, 10.126172104421087, 12.687381650363529, 2.5612095459424427], "isController": false}, {"data": ["olympiadTestCard", 500, 0, 0.0, 35561.09999999998, 11116, 58632, 35663.0, 54341.9, 56626.7, 58327.58, 6.561163163005538, 10.283854371703015, 1.6979572638637377], "isController": false}, {"data": ["checkLQLiveUpsell", 500, 0, 0.0, 5682.992000000002, 2868, 26792, 5481.5, 7833.6, 8222.8, 14155.680000000051, 15.087507543753771, 4.110756449909475, 4.0223530853952925], "isController": false}, {"data": ["moengageAttributes", 500, 0, 0.0, 2932.2380000000035, 2794, 10874, 2880.5, 3035.0, 3063.95, 4658.030000000005, 29.032632679131343, 6.974636366275694, 7.683440875043549], "isController": false}, {"data": ["dashboardUpsell", 500, 0, 0.0, 33735.134000000005, 7214, 58317, 33947.0, 53870.1, 56193.9, 57984.9, 6.916585973163646, 1.7764278427168347, 1.810200235163923], "isController": false}, {"data": ["getResults", 500, 0, 0.0, 35346.90799999998, 25619, 36797, 35279.5, 36074.3, 36502.55, 36727.95, 6.153997636864908, 34.18954351184029, 1.586577515754234], "isController": false}, {"data": ["getQuestionsSummary", 500, 0, 0.0, 20061.024, 3820, 37142, 19963.5, 33322.9, 35047.4, 36505.490000000005, 7.8823325398451916, 2.393950605363139, 2.1014421712673212], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 220, 100.0, 2.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11000, 220, "400/Bad Request", 220, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit OTP Result", 500, 220, "400/Bad Request", 220, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
