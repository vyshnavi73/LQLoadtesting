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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [6.521739130434783E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.0, 500, 1500, "Search for Test Users"], "isController": false}, {"data": [0.0, 500, 1500, "General Submit OTP"], "isController": false}, {"data": [0.0, 500, 1500, "Test Users Login"], "isController": false}, {"data": [0.015, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "General Send OTP"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11500, 0, 0.0, 32825.66034782599, 262, 198785, 23325.5, 76177.79999999999, 102220.49999999999, 148113.75999999992, 17.098490277649745, 126.52108756108994, 4.6310831131592956], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 500, 0, 0.0, 20449.464, 1977, 122212, 3015.5, 73404.30000000002, 86775.5, 94110.87, 3.8530003313580283, 0.7751153010349159, 0.9783008653838744], "isController": false}, {"data": ["Search for Test Users", 500, 0, 0.0, 33984.68, 7857, 69784, 31040.0, 51626.700000000026, 64127.99999999999, 69337.28, 4.868549172346641, 32.69154698149951, 1.3978061100292112], "isController": false}, {"data": ["General Submit OTP", 500, 0, 0.0, 52680.242, 2962, 87430, 61082.0, 79040.30000000002, 82275.2, 86947.5, 3.7768914672467973, 1.010613537134397, 0.9479112373851826], "isController": false}, {"data": ["Test Users Login", 500, 0, 0.0, 14421.479999999987, 1995, 41513, 5075.5, 38068.2, 41207.9, 41466.97, 9.698944754810677, 3.2203527506207323, 2.3679064342799503], "isController": false}, {"data": ["test-state", 500, 0, 0.0, 16554.39199999999, 262, 27245, 19384.0, 24703.800000000003, 25684.8, 27030.99, 11.954001004136085, 3.61888702273651, 3.198629174934851], "isController": false}, {"data": ["getTestState", 500, 0, 0.0, 32541.642000000018, 11766, 75519, 20293.0, 68493.6, 73575.85, 74433.61, 4.409054434186045, 1.0678178707794326, 1.12809791187182], "isController": false}, {"data": ["General Send OTP", 500, 0, 0.0, 55021.352000000035, 6397, 89109, 62386.5, 80167.20000000001, 83749.45, 88117.61, 3.691617075943946, 0.9089813928655808, 1.0058214494026962], "isController": false}, {"data": ["getQuestionWiseAnalysis", 500, 0, 0.0, 20987.064, 12704, 27538, 21044.5, 25041.9, 25941.65, 27292.69, 8.937668698496683, 213.91925989399925, 2.3653400559498063], "isController": false}, {"data": ["sub-user-1", 500, 0, 0.0, 77419.73799999998, 3115, 123283, 92550.0, 112544.20000000003, 116878.95, 122231.89, 2.483571176666352, 125.40821760926471, 0.6330196065526542], "isController": false}, {"data": ["extras", 500, 0, 0.0, 19412.784, 3351, 35954, 19191.5, 32819.8, 34617.95, 35820.99, 7.232331414354732, 8.334131903260335, 1.8151456772355137], "isController": false}, {"data": ["testLeaderboard", 500, 0, 0.0, 32338.798000000017, 16454, 35942, 35432.5, 35856.8, 35880.95, 35921.99, 5.5446510751078435, 36.49506664670592, 1.4511391485633809], "isController": false}, {"data": ["menu", 500, 0, 0.0, 13131.372000000001, 9600, 19769, 11300.0, 18851.8, 19427.05, 19672.89, 11.00957833314984, 5.827335406803919, 2.7523945832874603], "isController": false}, {"data": ["userProfile", 500, 0, 0.0, 82485.508, 12384, 122321, 97479.5, 111989.20000000001, 115223.95, 121331.67, 2.3664046267943264, 3.1451920869795686, 0.5985339827536431], "isController": false}, {"data": ["referral_page", 500, 0, 0.0, 14967.648000000007, 9597, 40909, 10282.5, 30080.8, 33252.95, 36128.15, 7.703448063353157, 133.0123683673312, 1.993568102332604], "isController": false}, {"data": ["get-priority", 500, 0, 0.0, 19321.693999999985, 11934, 24565, 20256.0, 23416.5, 23614.2, 24410.34, 8.738203425375744, 3.916831418210416, 2.3210852848654318], "isController": false}, {"data": ["sub-user", 500, 0, 0.0, 97869.41400000002, 6527, 198785, 95671.0, 175554.0, 185898.94999999998, 193583.63, 2.4418474040720244, 123.7926018433506, 1.2423852514858642], "isController": false}, {"data": ["updateModal", 500, 0, 0.0, 19987.79, 10350, 24367, 22012.5, 23352.7, 23702.9, 24295.94, 8.998308318036209, 11.274247628945758, 2.275939310909549], "isController": false}, {"data": ["olympiadTestCard", 500, 0, 0.0, 29774.540000000008, 10114, 43097, 33200.5, 39492.200000000004, 41079.7, 42776.9, 6.295405612983644, 9.867310555506592, 1.6291821166412752], "isController": false}, {"data": ["checkLQLiveUpsell", 500, 0, 0.0, 11057.491999999991, 3177, 25790, 7170.5, 23814.0, 25055.8, 25701.57, 13.040870086852195, 3.5531276896794552, 3.476716341514306], "isController": false}, {"data": ["moengageAttributes", 500, 0, 0.0, 6845.314000000002, 3148, 25703, 4131.0, 16026.700000000003, 18049.4, 20540.260000000006, 13.070870258541813, 3.140072347266881, 3.459185390688312], "isController": false}, {"data": ["dashboardUpsell", 500, 0, 0.0, 28402.466000000004, 4490, 42501, 32762.5, 38987.3, 40739.799999999996, 42228.99, 6.777639212709429, 1.740741321232988, 1.7738352627012957], "isController": false}, {"data": ["getResults", 500, 0, 0.0, 32432.592000000008, 24490, 35965, 35042.0, 35870.9, 35898.0, 35950.99, 5.136159590750804, 28.534777257598947, 1.3241661444904416], "isController": false}, {"data": ["getQuestionsSummary", 500, 0, 0.0, 22902.721999999998, 14151, 35172, 21424.5, 32088.800000000003, 33575.35, 34886.94, 6.376656336483402, 1.9366602740686893, 1.7000265428320005], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11500, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
