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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.11695652173913043, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.71, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.0, 500, 1500, "Search for Test Users"], "isController": false}, {"data": [0.045, 500, 1500, "General Submit OTP"], "isController": false}, {"data": [0.68, 500, 1500, "Test Users Login"], "isController": false}, {"data": [0.13, 500, 1500, "test-state"], "isController": false}, {"data": [0.025, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "General Send OTP"], "isController": false}, {"data": [0.045, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.015, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.06, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.015, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.42, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.475, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.02, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.05, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2300, 0, 0.0, 6551.204347826069, 3, 41932, 4184.0, 17390.4, 23934.749999999996, 33835.799999999974, 17.479993008002797, 129.3444447465971, 4.734412168735132], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 100, 0, 0.0, 986.5000000000002, 171, 32338, 531.0, 831.9000000000001, 855.9, 32146.399999999903, 2.9985906623886773, 0.6032321059102222, 0.7613609103721252], "isController": false}, {"data": ["Search for Test Users", 100, 0, 0.0, 3558.640000000001, 2587, 4372, 3601.0, 4230.0, 4294.9, 4371.7, 22.841480127912288, 153.37697007766104, 6.558003083599817], "isController": false}, {"data": ["General Submit OTP", 100, 0, 0.0, 11834.030000000006, 270, 23548, 11752.0, 21469.100000000002, 22846.05, 23547.93, 4.076807044722573, 1.0908643850136572, 1.0231830180602552], "isController": false}, {"data": ["Test Users Login", 100, 0, 0.0, 587.5799999999997, 285, 895, 596.0, 831.4000000000001, 865.4999999999999, 894.9399999999999, 76.98229407236336, 25.560527328714397, 18.794505388760587], "isController": false}, {"data": ["test-state", 100, 0, 0.0, 3739.660000000002, 3, 7081, 3855.0, 6485.9, 6944.9, 7080.61, 12.489072061945798, 3.7808714250031223, 3.3418024853253403], "isController": false}, {"data": ["getTestState", 100, 0, 0.0, 3443.140000000002, 1281, 5847, 3430.5, 5129.8, 5644.949999999999, 5846.55, 7.177720356014929, 1.7383541487223657, 1.8364870442147574], "isController": false}, {"data": ["General Send OTP", 100, 0, 0.0, 13825.32, 2933, 24930, 13851.0, 23150.100000000002, 24141.25, 24928.809999999998, 3.745318352059925, 0.9242231390449438, 1.0204529494382022], "isController": false}, {"data": ["getQuestionWiseAnalysis", 100, 0, 0.0, 4284.35, 181, 7341, 4331.5, 6897.800000000001, 7184.75, 7340.84, 10.680337498664958, 255.62928882302683, 2.8265346309943395], "isController": false}, {"data": ["sub-user-1", 100, 0, 0.0, 18503.34, 1271, 35575, 18461.0, 33408.1, 34575.9, 35575.0, 2.376143519068552, 119.98364544968516, 0.6056381430438398], "isController": false}, {"data": ["extras", 100, 0, 0.0, 3938.19, 750, 7892, 3900.5, 6573.400000000001, 6827.799999999999, 7887.399999999998, 4.936321453253036, 5.688339174647053, 1.2389009897324514], "isController": false}, {"data": ["testLeaderboard", 100, 0, 0.0, 7495.240000000003, 1905, 7878, 7627.0, 7816.6, 7838.6, 7877.91, 4.336889582791223, 28.545542761731287, 1.1350453204961402], "isController": false}, {"data": ["menu", 100, 0, 0.0, 2203.4499999999994, 1735, 4247, 2186.0, 2584.3, 2636.6, 4231.299999999992, 10.855405992184108, 5.745732468519323, 2.713851498046027], "isController": false}, {"data": ["userProfile", 100, 0, 0.0, 20015.710000000003, 1983, 34592, 20502.0, 32338.6, 33831.0, 34591.92, 2.336721579623788, 3.1057403026054446, 0.591026258908751], "isController": false}, {"data": ["referral_page", 100, 0, 0.0, 2143.0800000000004, 1745, 9339, 1985.0, 2229.8, 2525.8499999999967, 9327.699999999993, 6.296039790971479, 108.71121049235032, 1.629346234968205], "isController": false}, {"data": ["get-priority", 100, 0, 0.0, 3823.0699999999993, 1457, 6329, 3815.0, 5910.3, 6062.65, 6327.969999999999, 9.316191540898082, 4.175910075461151, 2.474613378051053], "isController": false}, {"data": ["sub-user", 100, 0, 0.0, 19490.05, 2127, 41932, 18982.5, 34499.40000000001, 35762.9, 41907.80999999999, 2.3286682346366114, 118.05483795379922, 1.1848009279742915], "isController": false}, {"data": ["updateModal", 100, 0, 0.0, 4346.59, 1802, 6118, 4343.5, 5893.2, 6029.15, 6117.98, 9.03995660820828, 11.326430008135961, 2.2864733999276803], "isController": false}, {"data": ["olympiadTestCard", 100, 0, 0.0, 6945.31, 1761, 11332, 6961.0, 10658.7, 11038.25, 11331.53, 6.299609424215698, 9.873899536978707, 1.6302700170089455], "isController": false}, {"data": ["checkLQLiveUpsell", 100, 0, 0.0, 1234.38, 571, 4850, 1205.0, 1739.8000000000002, 1795.3999999999999, 4821.569999999985, 12.44090569793481, 3.38966082980841, 3.316764897984573], "isController": false}, {"data": ["moengageAttributes", 100, 0, 0.0, 787.8199999999999, 560, 7098, 630.5, 754.0, 1508.049999999991, 7085.079999999994, 7.616726331022926, 1.829799489679336, 2.015754722370325], "isController": false}, {"data": ["dashboardUpsell", 100, 0, 0.0, 6213.839999999995, 609, 10804, 6269.5, 10094.1, 10668.0, 10803.96, 7.166403898523721, 1.8405900637809947, 1.875582270316755], "isController": false}, {"data": ["getResults", 100, 0, 0.0, 7090.540000000001, 3085, 7836, 7145.0, 7451.4, 7472.8, 7832.589999999998, 4.427129449265097, 24.59564398131751, 1.1413693111386576], "isController": false}, {"data": ["getQuestionsSummary", 100, 0, 0.0, 4187.869999999999, 1140, 7601, 3999.5, 7099.8, 7304.15, 7599.669999999999, 5.958410296132992, 1.8096343770482035, 1.5885214949651432], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2300, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
