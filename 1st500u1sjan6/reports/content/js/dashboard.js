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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [5.5E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.009, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.002, 500, 1500, "sub-login"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10000, 0, 0.0, 34993.63190000003, 291, 173442, 21343.0, 90431.49999999999, 125698.7999999999, 158555.91999999998, 17.382023858565947, 107.51909890610578, 4.732974022456705], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 500, 0, 0.0, 84939.77399999989, 8274, 159554, 86397.0, 144373.7, 151479.9, 158547.89, 2.2789633451535565, 0.45845442700024613, 0.5786341346548283], "isController": false}, {"data": ["test-state", 500, 0, 0.0, 22911.041999999987, 291, 43598, 23420.5, 39716.5, 41522.649999999994, 43335.86, 10.069885001913278, 3.0485003423760904, 2.6944809477775764], "isController": false}, {"data": ["getTestState", 500, 0, 0.0, 18419.533999999996, 7047, 67018, 16909.5, 26012.600000000002, 38299.89999999997, 60526.97, 4.743292983721019, 1.148766269494934, 1.2182203075788334], "isController": false}, {"data": ["sub-login", 500, 0, 0.0, 86438.80600000003, 1458, 162994, 86537.0, 148150.6, 156215.65, 161638.98, 2.8037278365314524, 0.9336413695649736, 0.7190740496063566], "isController": false}, {"data": ["getQuestionWiseAnalysis", 500, 0, 0.0, 25957.32199999999, 7133, 43854, 26305.5, 40326.600000000006, 42088.049999999996, 43714.14, 7.173189486973487, 213.3656666717477, 1.9053364270701827], "isController": false}, {"data": ["sub-user-1", 500, 0, 0.0, 46238.75600000001, 8907, 95372, 42864.0, 84713.7, 87917.09999999999, 91314.79000000001, 2.6040039164218904, 68.63925964750901, 0.6637056700883278], "isController": false}, {"data": ["extras", 500, 0, 0.0, 18063.374000000003, 3676, 33867, 17915.5, 30062.700000000004, 31541.8, 32766.08, 8.289262089888759, 9.465511618436976, 2.0884569175964454], "isController": false}, {"data": ["testLeaderboard", 500, 0, 0.0, 40625.96600000001, 19348, 45598, 41459.0, 44312.7, 44955.6, 45478.590000000004, 5.116345701246342, 47.935762361091214, 1.3440400328469395], "isController": false}, {"data": ["menu", 500, 0, 0.0, 10244.435999999998, 7927, 18739, 9891.5, 11932.9, 14196.799999999996, 16877.71, 12.799508498873642, 6.501625337587036, 3.2123016476167314], "isController": false}, {"data": ["userProfile", 500, 0, 0.0, 65486.24599999995, 12496, 91549, 69727.5, 88885.8, 89998.75, 90783.65, 3.869789328668947, 5.181829307462502, 0.9825410221855023], "isController": false}, {"data": ["referral_page", 500, 0, 0.0, 9996.68600000001, 7949, 17709, 9833.5, 11721.300000000001, 11958.75, 12116.83, 13.14647805852812, 227.43733135533614, 3.4149260592774695], "isController": false}, {"data": ["get-priority", 500, 0, 0.0, 18673.07400000001, 7144, 30312, 18265.0, 28579.9, 29454.75, 30203.87, 8.900281248887465, 3.849927907721884, 2.372776737557407], "isController": false}, {"data": ["sub-user", 500, 0, 0.0, 131179.3820000001, 99595, 173442, 125981.0, 165354.5, 168794.35, 172565.5, 1.7276766894950346, 45.88759565389971, 0.8790095056771455], "isController": false}, {"data": ["updateModal", 500, 0, 0.0, 21434.159999999978, 9299, 30281, 22293.5, 28934.6, 29711.2, 30209.81, 9.77822974928619, 12.232947378456604, 2.4826963529647594], "isController": false}, {"data": ["olympiadTestCard", 500, 0, 0.0, 15979.291999999989, 10329, 20545, 16015.0, 19640.100000000002, 20047.75, 20503.9, 12.437810945273633, 19.75889594993781, 3.230842856032338], "isController": false}, {"data": ["checkLQLiveUpsell", 500, 0, 0.0, 5475.931999999998, 3460, 12218, 5391.5, 6549.0, 8696.249999999998, 11321.95, 23.674242424242426, 6.432088216145833, 6.334570682410037], "isController": false}, {"data": ["moengageAttributes", 500, 0, 0.0, 4155.051999999999, 3452, 22622, 3715.0, 5163.5, 5307.0, 5401.0, 15.862440912407603, 3.81070357856667, 4.213367923368548], "isController": false}, {"data": ["dashboardUpsell", 500, 0, 0.0, 13845.508000000003, 4895, 20463, 14153.0, 19268.0, 19786.95, 20417.89, 14.381040036815463, 3.693567900080534, 3.7777475426397835], "isController": false}, {"data": ["getResults", 500, 0, 0.0, 33443.82799999998, 21797, 43548, 33643.5, 35267.9, 35290.95, 35385.97, 4.991265285749938, 29.780939995632643, 1.2916556182929873], "isController": false}, {"data": ["getQuestionsSummary", 500, 0, 0.0, 26364.468000000008, 6882, 45317, 25585.0, 43071.5, 43864.35, 45064.39, 5.134313644951943, 1.5593472105273967, 1.3737999344091432], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
