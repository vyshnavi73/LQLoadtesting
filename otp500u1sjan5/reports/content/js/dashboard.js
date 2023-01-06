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

    var data = {"OkPercent": 97.71818181818182, "KoPercent": 2.2818181818181817};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [3.636363636363636E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.008, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11000, 251, 2.2818181818181817, 54201.15972727279, 429, 261462, 29523.0, 157289.49999999997, 175123.29999999996, 199851.75, 10.8920273330475, 80.94798643855955, 2.9226875545220232], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 500, 0, 0.0, 95757.12199999987, 4701, 185422, 96392.5, 167980.80000000002, 176910.8, 183956.35, 1.565538122418819, 0.31494223947097333, 0.39749991389540323], "isController": false}, {"data": ["test-state", 500, 0, 0.0, 20220.52, 429, 38617, 20366.0, 35278.7, 36915.9, 38390.98, 11.899662049597792, 3.6024367532962063, 3.184089259365034], "isController": false}, {"data": ["getTestState", 500, 0, 0.0, 17118.41800000001, 6035, 101798, 16065.0, 25483.700000000004, 26766.8, 63702.38000000001, 3.7324574499850702, 0.9039545386682591, 0.9549842303672738], "isController": false}, {"data": ["getQuestionWiseAnalysis", 500, 0, 0.0, 21472.648000000016, 4302, 38814, 21447.5, 35638.40000000001, 37376.15, 38610.35, 8.463387386167438, 202.56754047615016, 2.239822247706422], "isController": false}, {"data": ["sub-user-1", 500, 0, 0.0, 92430.62599999997, 5448, 178168, 93351.5, 162568.0, 170751.75, 177141.09, 1.7219765535672467, 86.95140786650549, 0.43890222703227677], "isController": false}, {"data": ["Send OTP Result", 500, 0, 0.0, 147856.9660000002, 85866, 173259, 147879.5, 168105.4, 171160.94999999998, 173093.51, 1.6703860596261009, 0.4111237689254741, 0.38986549633851375], "isController": false}, {"data": ["extras", 500, 0, 0.0, 19342.006000000012, 2979, 36200, 19604.5, 32347.800000000007, 33858.35, 35232.97, 8.771314293733772, 10.107569205669778, 2.2013943100484177], "isController": false}, {"data": ["Result Login Validation", 500, 0, 0.0, 94649.44599999994, 2966, 173276, 97684.0, 156856.7, 165160.05, 172301.29, 2.66699381790833, 0.7396740666855134, 0.6485170514249747], "isController": false}, {"data": ["testLeaderboard", 500, 0, 0.0, 38352.00399999999, 21031, 39430, 39006.5, 39343.0, 39352.0, 39369.99, 5.411431107070576, 35.61820865396062, 1.416272985053627], "isController": false}, {"data": ["menu", 500, 0, 0.0, 11447.665999999996, 9015, 23869, 11124.5, 13456.7, 13789.45, 19584.590000000004, 11.383816766085333, 6.025418639861573, 2.8459541915213333], "isController": false}, {"data": ["Submit OTP Result", 500, 251, 50.2, 155898.21399999986, 124583, 187501, 155005.5, 181528.6, 184212.19999999998, 186848.14, 1.2492254802022744, 0.43532092134126843, 0.31474626356658875], "isController": false}, {"data": ["userProfile", 500, 0, 0.0, 102566.00200000001, 18076, 177245, 102859.5, 163428.6, 169741.55, 176253.42, 2.3727494471493786, 3.1536249976272503, 0.6001387761832901], "isController": false}, {"data": ["referral_page", 500, 0, 0.0, 10317.949999999999, 9028, 31574, 10113.0, 11350.5, 11631.65, 12381.070000000005, 9.68447965290825, 167.21805150690503, 2.5062374101764515], "isController": false}, {"data": ["get-priority", 500, 0, 0.0, 18954.32199999999, 6194, 32775, 18955.5, 29167.0, 30465.6, 32497.02, 8.61014964440082, 3.859432311308571, 2.287070999293968], "isController": false}, {"data": ["sub-user", 500, 0, 0.0, 188192.23800000013, 106580, 261462, 186945.0, 212772.0, 230789.99999999997, 256666.96000000002, 1.1246468608856819, 57.015422352693754, 0.572208021993594], "isController": false}, {"data": ["updateModal", 500, 0, 0.0, 24060.608000000007, 11501, 32610, 24281.0, 31057.9, 31862.05, 32431.99, 9.335673475484521, 11.69694245024086, 2.361268974756339], "isController": false}, {"data": ["olympiadTestCard", 500, 0, 0.0, 34904.09199999999, 10399, 58061, 35255.5, 53788.600000000006, 56015.9, 57664.63, 6.377144314775844, 9.995426391811746, 1.6503351986480455], "isController": false}, {"data": ["checkLQLiveUpsell", 500, 0, 0.0, 5855.687999999996, 2788, 31804, 5554.0, 8043.0, 8439.7, 20343.850000000017, 12.576085316162784, 3.426491995321696, 3.352803995422305], "isController": false}, {"data": ["moengageAttributes", 500, 0, 0.0, 2994.7999999999997, 2770, 18222, 2856.0, 3104.9, 3245.5, 5246.9400000000005, 19.10146699266504, 4.588828984566015, 5.055173393566626], "isController": false}, {"data": ["dashboardUpsell", 500, 0, 0.0, 33443.874, 5805, 57548, 33666.5, 53429.6, 55729.75, 57290.82, 6.774058067225752, 1.739821554375364, 1.7728980097817397], "isController": false}, {"data": ["getResults", 500, 0, 0.0, 36668.872000000025, 21843, 39494, 36317.0, 38613.7, 39220.05, 39421.81, 5.36428885622633, 29.80218681940585, 1.3829807207458507], "isController": false}, {"data": ["getQuestionsSummary", 500, 0, 0.0, 19921.43200000001, 4057, 38501, 19675.5, 33201.4, 34942.9, 37127.22, 6.4750064750064755, 1.966530286842787, 1.7262468434343434], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 251, 100.0, 2.2818181818181817], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11000, 251, "400/Bad Request", 251, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit OTP Result", 500, 251, "400/Bad Request", 251, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
