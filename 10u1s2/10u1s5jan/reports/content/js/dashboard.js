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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.76, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.95, 500, 1500, "test-state"], "isController": false}, {"data": [1.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "sub-login"], "isController": false}, {"data": [0.7, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.7, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.8, 500, 1500, "extras"], "isController": false}, {"data": [0.55, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [1.0, 500, 1500, "menu"], "isController": false}, {"data": [0.55, 500, 1500, "userProfile"], "isController": false}, {"data": [1.0, 500, 1500, "referral_page"], "isController": false}, {"data": [1.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.2, 500, 1500, "sub-user"], "isController": false}, {"data": [1.0, 500, 1500, "updateModal"], "isController": false}, {"data": [1.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [1.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.95, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [1.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.6, 500, 1500, "getResults"], "isController": false}, {"data": [0.8, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 200, 0, 0.0, 760.6000000000004, 3, 6681, 340.0, 1584.2000000000012, 4200.649999999998, 6253.840000000001, 14.916467780429594, 57.45097959240752, 4.061605594607697], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 10, 0, 0.0, 1806.1999999999998, 53, 5035, 1077.0, 4935.700000000001, 5035.0, 5035.0, 1.7286084701815039, 0.34774740708729474, 0.43890449438202245], "isController": false}, {"data": ["test-state", 10, 0, 0.0, 190.4, 3, 564, 111.5, 547.1, 564.0, 564.0, 10.95290251916758, 3.3158200985761224, 2.9307571193866373], "isController": false}, {"data": ["getTestState", 10, 0, 0.0, 301.4, 174, 434, 284.5, 432.8, 434.0, 434.0, 9.784735812133071, 2.3697407045009786, 2.5130717954990214], "isController": false}, {"data": ["sub-login", 10, 0, 0.0, 4753.200000000001, 1604, 6681, 5346.0, 6638.400000000001, 6681.0, 6681.0, 1.4792899408284024, 0.4926151072485207, 0.37921250924556216], "isController": false}, {"data": ["getQuestionWiseAnalysis", 10, 0, 0.0, 557.1, 137, 968, 545.5, 952.1, 968.0, 968.0, 8.25082508250825, 237.9396142739274, 2.191625412541254], "isController": false}, {"data": ["sub-user-1", 10, 0, 0.0, 515.4, 206, 768, 604.5, 767.3, 768.0, 768.0, 6.934812760055479, 25.761745839112344, 1.767564580443828], "isController": false}, {"data": ["extras", 10, 0, 0.0, 465.4, 249, 810, 439.0, 792.0, 810.0, 810.0, 4.7125353440150795, 5.374315209707823, 1.1873380065975496], "isController": false}, {"data": ["testLeaderboard", 10, 0, 0.0, 705.9, 294, 859, 726.5, 856.2, 859.0, 859.0, 4.0096230954290295, 36.13359562951082, 1.053309192060946], "isController": false}, {"data": ["menu", 10, 0, 0.0, 224.7, 193, 303, 217.5, 297.70000000000005, 303.0, 303.0, 11.723329425556859, 5.941804660023447, 2.94228092028136], "isController": false}, {"data": ["userProfile", 10, 0, 0.0, 649.9, 213, 868, 656.5, 861.1, 868.0, 868.0, 6.910850034554251, 9.316149792674498, 1.75470801658604], "isController": false}, {"data": ["referral_page", 10, 0, 0.0, 298.2, 265, 318, 303.0, 317.8, 318.0, 318.0, 11.148272017837236, 192.83026755852842, 2.8959378483835003], "isController": false}, {"data": ["get-priority", 10, 0, 0.0, 365.5, 218, 474, 359.0, 473.4, 474.0, 474.0, 10.330578512396695, 4.469185821280992, 2.7541483729338845], "isController": false}, {"data": ["sub-user", 10, 0, 0.0, 2322.1, 612, 5241, 1742.5, 5145.200000000001, 5241.0, 5241.0, 1.5441630636195183, 6.046966684681903, 0.7856532774861026], "isController": false}, {"data": ["updateModal", 10, 0, 0.0, 298.5999999999999, 215, 400, 284.5, 399.7, 400.0, 400.0, 10.0, 12.509765625, 2.5390625], "isController": false}, {"data": ["olympiadTestCard", 10, 0, 0.0, 302.9, 229, 362, 313.0, 361.7, 362.0, 362.0, 12.195121951219512, 19.390720274390244, 3.167873475609756], "isController": false}, {"data": ["checkLQLiveUpsell", 10, 0, 0.0, 158.1, 88, 426, 120.0, 407.80000000000007, 426.0, 426.0, 10.121457489878543, 2.747817560728745, 2.708280617408907], "isController": false}, {"data": ["moengageAttributes", 10, 0, 0.0, 174.3, 75, 544, 99.5, 533.0, 544.0, 544.0, 7.052186177715092, 1.6941775387870242, 1.8732369534555713], "isController": false}, {"data": ["dashboardUpsell", 10, 0, 0.0, 198.00000000000003, 116, 275, 189.0, 274.8, 275.0, 275.0, 11.990407673860911, 3.0795675959232613, 3.14982389088729], "isController": false}, {"data": ["getResults", 10, 0, 0.0, 547.0999999999999, 215, 750, 583.0, 739.1, 750.0, 750.0, 4.837929366231253, 28.215900157232703, 1.252003205128205], "isController": false}, {"data": ["getQuestionsSummary", 10, 0, 0.0, 377.6000000000001, 10, 752, 403.5, 735.1, 752.0, 752.0, 5.47645125958379, 1.6632581462212486, 1.4653785596933186], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
