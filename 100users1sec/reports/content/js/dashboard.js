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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.061136363636363635, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.035, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.095, 500, 1500, "test-state"], "isController": false}, {"data": [0.015, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "sub-login"], "isController": false}, {"data": [0.045, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.06, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.07, 500, 1500, "olympiad-dashboard"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.005, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.46, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.49, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.01, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "user-stats"], "isController": false}, {"data": [0.06, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 0, 0.0, 8397.454999999982, 199, 43565, 4915.5, 26293.2, 35298.499999999985, 37337.99, 14.353380221042055, 114.21093209709409, 3.9088240259274243], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 100, 0, 0.0, 16837.87, 218, 36689, 16612.5, 30906.600000000006, 32034.8, 36652.279999999984, 1.4201116207733926, 0.28568651746027235, 0.36196204396665577], "isController": false}, {"data": ["test-state", 100, 0, 0.0, 4068.88, 229, 8841, 4024.0, 7176.1, 7539.4, 8829.069999999994, 5.7019044360816515, 1.726162475766906, 1.5312731639867716], "isController": false}, {"data": ["getTestState", 100, 0, 0.0, 3491.6300000000015, 1391, 5905, 3468.5, 5300.200000000001, 5576.45, 5904.9, 6.722689075630252, 1.6281512605042017, 1.7266281512605042], "isController": false}, {"data": ["sub-login", 100, 0, 0.0, 20229.589999999997, 3237, 37590, 20502.5, 34155.9, 35966.65, 37584.079999999994, 2.650551314673452, 0.8826542952184054, 0.6936989768871925], "isController": false}, {"data": ["getQuestionWiseAnalysis", 100, 0, 0.0, 4518.210000000001, 1080, 9067, 4492.5, 7473.500000000001, 7775.95, 9055.109999999993, 5.438329345225147, 130.16407609582336, 1.4445562323254295], "isController": false}, {"data": ["sub-user-1", 100, 0, 0.0, 19741.68, 1849, 37344, 19661.0, 34893.40000000001, 36112.15, 37342.92, 2.2581519284617473, 114.02564625485503, 0.5777693410712673], "isController": false}, {"data": ["extras", 100, 0, 0.0, 4154.24, 855, 7406, 4137.5, 6931.100000000001, 7166.85, 7405.5199999999995, 4.5075501464953796, 5.189845334685598, 1.1356913455037188], "isController": false}, {"data": ["testLeaderboard", 100, 0, 0.0, 7346.220000000001, 4970, 7778, 7369.5, 7450.5, 7513.95, 7776.019999999999, 4.226185445017327, 27.816884667399208, 1.1101991061617784], "isController": false}, {"data": ["menu", 100, 0, 0.0, 2371.0499999999997, 1919, 6552, 2312.5, 2677.8, 2711.8, 6514.069999999981, 7.870916961826053, 4.166051751279024, 1.9754156828020464], "isController": false}, {"data": ["userProfile", 100, 0, 0.0, 20653.879999999994, 3482, 35756, 20665.5, 33114.3, 34809.45, 35755.83, 2.177842629091622, 2.8945740412047822, 0.5529678550427946], "isController": false}, {"data": ["referral_page", 100, 0, 0.0, 2429.4299999999994, 1940, 6518, 2412.5, 2576.5, 2613.75, 6496.399999999989, 6.055468087683178, 104.55735474445925, 1.5730024524645756], "isController": false}, {"data": ["get-priority", 100, 0, 0.0, 4475.219999999999, 2363, 6306, 4473.0, 5977.5, 6157.3, 6305.62, 7.898894154818325, 2.4761181872037916, 2.1058575236966823], "isController": false}, {"data": ["olympiad-dashboard", 100, 0, 0.0, 4895.37, 199, 9252, 4953.0, 8565.0, 8955.4, 9250.939999999999, 9.813542688910697, 111.8303023797841, 2.635472890088322], "isController": false}, {"data": ["sub-user", 100, 0, 0.0, 36579.630000000005, 34209, 43565, 36582.5, 37827.0, 38322.549999999996, 43521.699999999975, 1.2937782205374355, 65.5897546511327, 0.6607871184971472], "isController": false}, {"data": ["updateModal", 100, 0, 0.0, 2724.0200000000004, 2442, 2778, 2723.0, 2771.9, 2775.0, 2777.99, 11.301989150090415, 14.160597733951175, 2.8696456826401446], "isController": false}, {"data": ["olympiadTestCard", 100, 0, 0.0, 6860.679999999998, 1433, 11066, 6852.5, 10350.0, 10852.199999999999, 11065.449999999999, 6.268806419257774, 13.106947796514543, 1.6284204175025074], "isController": false}, {"data": ["checkLQLiveUpsell", 100, 0, 0.0, 1178.0000000000002, 773, 6780, 1053.5, 1485.9, 1527.1999999999998, 6727.969999999973, 10.214504596527068, 2.7830534984678246, 2.733177987742595], "isController": false}, {"data": ["moengageAttributes", 100, 0, 0.0, 841.06, 631, 7468, 774.0, 803.0, 851.2999999999996, 7426.639999999979, 6.377551020408164, 1.5321069834183674, 1.6940369897959184], "isController": false}, {"data": ["dashboardUpsell", 100, 0, 0.0, 6084.750000000005, 679, 10785, 6126.0, 9991.300000000001, 10527.749999999998, 10784.98, 7.2500543754078155, 1.8620745124338434, 1.9045552997897486], "isController": false}, {"data": ["getResults", 100, 0, 0.0, 7354.9500000000035, 1525, 7548, 7441.5, 7510.7, 7527.8, 7547.97, 4.37598459653422, 23.708947794503764, 1.1324569512515317], "isController": false}, {"data": ["user-stats", 100, 0, 0.0, 3895.4399999999996, 1531, 6414, 3817.0, 5919.3, 6222.3, 6413.66, 8.437394532568343, 3.781996182078974, 2.249422565811677], "isController": false}, {"data": ["getQuestionsSummary", 100, 0, 0.0, 4012.209999999999, 559, 7387, 3992.0, 6779.4000000000015, 7008.8, 7385.249999999999, 5.985156811108451, 1.8177575861862583, 1.6014970373473787], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
