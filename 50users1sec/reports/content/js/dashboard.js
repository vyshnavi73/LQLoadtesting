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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.18681818181818183, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.17, 500, 1500, "test-state"], "isController": false}, {"data": [0.09, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "sub-login"], "isController": false}, {"data": [0.13, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.01, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.15, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.48, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.47, 500, 1500, "referral_page"], "isController": false}, {"data": [0.1, 500, 1500, "get-priority"], "isController": false}, {"data": [0.17, 500, 1500, "olympiad-dashboard"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.5, 500, 1500, "updateModal"], "isController": false}, {"data": [0.05, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.5, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.67, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.13, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.02, 500, 1500, "getResults"], "isController": false}, {"data": [0.17, 500, 1500, "user-stats"], "isController": false}, {"data": [0.21, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1100, 0, 0.0, 4150.417272727267, 177, 20688, 2524.0, 12693.199999999997, 17006.75, 18258.89, 14.447640437632163, 114.96096777026938, 3.934493700500414], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 50, 0, 0.0, 8240.380000000006, 236, 16895, 8374.0, 15378.899999999998, 16119.899999999994, 16895.0, 1.498531439189594, 0.3014623793682191, 0.3819499078403165], "isController": false}, {"data": ["test-state", 50, 0, 0.0, 2359.640000000001, 177, 4100, 2521.0, 3851.7, 3982.149999999999, 4100.0, 5.448997384481255, 1.6495988175675675, 1.463353789777681], "isController": false}, {"data": ["getTestState", 50, 0, 0.0, 2113.819999999999, 1087, 2729, 2248.0, 2671.8, 2705.45, 2729.0, 6.570302233902759, 1.5912450722733245, 1.6874897339027595], "isController": false}, {"data": ["sub-login", 50, 0, 0.0, 10359.799999999997, 2320, 18561, 10323.0, 17346.5, 18281.899999999998, 18561.0, 2.612876254180602, 0.8701082057378763, 0.6838387071488294], "isController": false}, {"data": ["getQuestionWiseAnalysis", 50, 0, 0.0, 2478.06, 727, 4321, 2375.0, 4017.5, 4237.7, 4321.0, 5.142974696564493, 123.09488949033121, 1.3661026537749434], "isController": false}, {"data": ["sub-user-1", 50, 0, 0.0, 9653.220000000001, 1398, 18078, 9497.0, 17015.3, 17855.6, 18078.0, 2.3061666897283337, 116.45015725174115, 0.5900543678797103], "isController": false}, {"data": ["extras", 50, 0, 0.0, 2125.1, 516, 3827, 2139.0, 3467.5, 3690.4, 3827.0, 4.437344692935747, 5.109013079073482, 1.1180028620873268], "isController": false}, {"data": ["testLeaderboard", 50, 0, 0.0, 3619.439999999999, 3030, 4369, 3589.5, 3802.4, 4017.3999999999987, 4369.0, 4.051535531966615, 26.66733348188964, 1.0643193926748238], "isController": false}, {"data": ["menu", 50, 0, 0.0, 1261.96, 978, 3197, 1165.5, 1374.9, 2082.1999999999935, 3197.0, 8.065817067268913, 4.269211768027101, 2.0243310412969833], "isController": false}, {"data": ["userProfile", 50, 0, 0.0, 9213.260000000004, 1624, 16627, 9129.0, 15279.5, 16071.55, 16627.0, 2.2823754964166705, 3.03350883849911, 0.5795094033870453], "isController": false}, {"data": ["referral_page", 50, 0, 0.0, 1142.3799999999999, 982, 3374, 1042.5, 1099.7, 2270.1999999999935, 3374.0, 6.3075564526302506, 108.91006410054246, 1.6384863441402802], "isController": false}, {"data": ["get-priority", 50, 0, 0.0, 2100.0400000000004, 1254, 2952, 2059.0, 2890.0, 2920.4, 2952.0, 8.037293039704227, 2.519502993891657, 2.1427548826555216], "isController": false}, {"data": ["olympiad-dashboard", 50, 0, 0.0, 2371.8999999999996, 230, 4391, 2403.5, 3997.0, 4267.15, 4391.0, 9.30925339787749, 106.08366982405511, 2.5000436371253025], "isController": false}, {"data": ["sub-user", 50, 0, 0.0, 17893.7, 16657, 20688, 17814.5, 18315.8, 19527.549999999992, 20688.0, 1.3456776832813004, 68.22086481658414, 0.6872943636290236], "isController": false}, {"data": ["updateModal", 50, 0, 0.0, 1367.04, 1059, 1468, 1395.5, 1458.8, 1464.9, 1468.0, 11.452130096197893, 14.348713782638573, 2.9077674072377464], "isController": false}, {"data": ["olympiadTestCard", 50, 0, 0.0, 3231.8999999999996, 842, 5321, 3217.5, 5050.7, 5092.25, 5321.0, 6.425909266161162, 13.435421619971727, 1.6692303367176455], "isController": false}, {"data": ["checkLQLiveUpsell", 50, 0, 0.0, 725.5999999999999, 499, 3323, 561.5, 987.6999999999999, 2039.8499999999904, 3323.0, 9.565716472163764, 2.606284077864932, 2.5595764779031946], "isController": false}, {"data": ["moengageAttributes", 50, 0, 0.0, 643.1199999999999, 305, 3916, 540.0, 675.6999999999998, 2303.4999999999873, 3916.0, 6.143260842855387, 1.4758224290453374, 1.6318036613834626], "isController": false}, {"data": ["dashboardUpsell", 50, 0, 0.0, 2796.6399999999994, 336, 4829, 2814.5, 4696.3, 4803.55, 4829.0, 7.389890629618682, 1.8979894878805794, 1.9412896282885013], "isController": false}, {"data": ["getResults", 50, 0, 0.0, 3672.4000000000005, 688, 4036, 3778.0, 3956.7, 4018.0499999999997, 4036.0, 4.3740705100166215, 23.698577333566618, 1.1319616065960985], "isController": false}, {"data": ["user-stats", 50, 0, 0.0, 2000.2000000000005, 1189, 3176, 1937.5, 3006.6, 3049.1499999999996, 3176.0, 7.836990595611285, 3.5128698079937304, 2.089353938087774], "isController": false}, {"data": ["getQuestionsSummary", 50, 0, 0.0, 1939.5799999999995, 489, 3491, 1895.0, 3136.3, 3393.0499999999993, 3491.0, 5.215395848544905, 1.583972762595181, 1.3955258422864296], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1100, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
