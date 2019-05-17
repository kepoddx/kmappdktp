<template>
  <v-container fluid>
        <portal to="settings">
            <v-card ma-1>
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">Saved Settings</h3>
                            <div>{{settings$}}</div>
                        </div>
                    </v-card-title>
                    <v-card-actions>
                        <v-btn flat color="primary">text</v-btn>
                        <v-btn flat color="primary">text</v-btn>
                    </v-card-actions>
                </v-card>
            </v-card>
        </portal>
    <v-layout row wrap>
        <v-flex pa-1>
            <v-card>
                <v-card-title>
                    <v-icon>list</v-icon>
                    <span class="title font-weight-light">PID's</span>
                </v-card-title>
            </v-card>
        </v-flex>
        <v-flex pa-1>
            <v-card>
                <v-card-title>
                    <v-icon>storage</v-icon>
                    <span class="title font-weight-light">Data Sets</span>
                    <span class="count">{{dataSets.length}}</span>
                </v-card-title>
            </v-card>
        </v-flex>
        <v-flex pa-1>
            <v-card>
                <v-card-title>
                    <v-icon>compare_arrows</v-icon>
                    <span class="title font-weight-light">Mappings</span>
                    <span class="count">{{mappings.length}}</span>
                </v-card-title>
            </v-card>
        </v-flex>
        <v-flex pa-1>
            <v-card>
                <v-card-title>
                    <v-icon>compare_arrows</v-icon>
                    <span class="title font-weight-light">Mappings</span>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
    <v-layout row wrap mb-1>
      <v-flex pa-1 xs12>
        <v-card class="pa-2">
          <v-textarea id="excelPaste" :rows="rows" clearable clear-icon="clear_all" prepend-icon="add_to_photos" pa-1 v-model="rawData" @paste="onPaste" placeholder="Paste Excel Data Here..."></v-textarea>
        </v-card>
        <!-- <pre>{{rawData}}</pre> -->
        <v-btn @click="parsetToJson()" :disabled="!canLoadData">Load Data</v-btn>

        <template v-if="!showJson">
            <v-btn @click="showJson = !showJson" :disabled="!dataLoaded">Show JSON</v-btn>
        </template>
        <template v-else>
            <v-btn @click="showJson = !showJson">Hide JSON</v-btn>
        </template>
        <template v-if="!tableLoaded">
            <v-btn @click="loadTable = !loadTable; tableLoaded = !tableLoaded" :disabled="!dataLoaded">Show Table</v-btn>
        </template>
        <template v-else>
            <v-btn @click="loadTable = !loadTable; tableLoaded = !tableLoaded" :disabled="!canLoadData">Close Table</v-btn>
        </template>
        <v-btn color="error" @click="onClearData" :disabled="!canLoadData">Clear All Data</v-btn>
      </v-flex>
    </v-layout>
    <v-expansion-panel expand focusable v-if="tableData.headers">
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>Edit Headers</div>
        </template>
        <v-layout row wrap>
          <v-flex pa-1 xs6 md4 v-for="(header, index) in filteredTableData.headers" v-bind:key="index">
            <div class="headerOptions">
                <v-text-field class="headerTitle" v-model="filteredTableData.headers[index].text" :label="header.value"></v-text-field>
                <v-switch
                v-model="filteredTableData.headers[index].include"
                :label="`${filteredTableData.headers[index].include.toString()}`">
                </v-switch>
            </div>
          </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12 md7>
              <v-btn @click="filterHeaders">Apply Filter</v-btn>
              <v-btn @click="clearFilterHeader">Clear Filter</v-btn>
              <v-btn @click="updateJson">Update JSON</v-btn>
            </v-flex>
            <v-flex xs12 md5 px-3>
                <v-switch
                v-model="generateMapping"
                :label="`Generate Mapping =  ${generateMapping.toString().toUpperCase()}`">
                </v-switch> 
                <v-text-field :disabled="!generateMapping" v-model="mappingName" label="Name of File being Mapped"></v-text-field>         
            </v-flex>

        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel focusable v-if="showJson">
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>
              Show Raw JSON
          </div>
        </template>
        <v-btn id="copyBtn" @mouseleave="showCopyTooltip ? showCopyTooltip = false : ''" @click="doCopy(); showCopyTooltip = !showCopyTooltip"><v-icon left>fas fa-copy</v-icon> Copy JSON</v-btn>
        <v-tooltip activator="#copyBtn" v-model="showCopyTooltip" bottom color="success">
            <span>Copied!</span>
        </v-tooltip>
                <pre ref="jsonData">{{filteredTableData.items}}</pre>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel focusable v-if="showUpdatedJson">
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>
              Show Updated JSON
          </div>
        </template>
        <v-btn id="copyUpdatedBtn" @mouseleave="showCopyTooltip ? showCopyTooltip = false : ''" @click="doCopy(); showCopyTooltip = !showCopyTooltip"><v-icon left>fas fa-copy</v-icon> Copy JSON</v-btn>
        <v-tooltip activator="#copyUpdatedBtn" v-model="showCopyTooltip" bottom color="success">
            <span>Copied!</span>
        </v-tooltip>
                <pre ref="jsonData">{{updatedJson}}</pre>
      </v-expansion-panel-content>
    </v-expansion-panel>

        <v-data-table v-if="loadTable"
        :headers="filteredTableData.headers"
        :items="filteredTableData.items"
        class="elevation-1">
        <template v-slot:items="props">
           <td v-for="cells in props.item" v-bind:key="cells['Site']">
                {{cells}}
            </td>
        </template>
    </v-data-table>
  </v-container>
</template>

<script>

import { BehaviorSubject } from 'rxjs';

const outerSub$ = new BehaviorSubject({})

export default {
  data() {
    return {
      rawData: "",
      rows: 1,
      canLoadData: false,
      showUpdatedJson: false,
      updatedJson: null,
      generateMapping: false,
      mappings: [],
      mappingName: '',
      panel: [true],
      dataLoaded: false,
      showCopyTooltip: false,
      tableLoaded : false,
      loadTable: false,
      showJson: false,
      dataSets: [],
      tableData: {
        headers: null,
        items: null
      },
      filteredTableData: {
          headers: null, 
          items: null
      }
    };
  },
    subscriptions() {
        this.dataSet$ = new BehaviorSubject({})
        return {
            dataSet$: this.dataSet$,
            settings$: this.$db.getViewSettings$('pids')
        }
    },
  methods: {
    onClearData() {
        this.tableData.headers = null;
        this.tableData.items = null;
        this.filteredTableData.headers = null;
        this.filteredTableData.items = null;
        this.rawData = "";
        this.canLoadData = false;
        this.dataLoaded = false;
        this.loadTable = false;
        /* eslint-disable no-unused-expressions */
        this.rows === 1 ? '' : this.rows = 1;
    },
    onPaste() {
        this.canLoadData = true
        this.rows = 20
    },
    updateJson() {
        const newJson = [];
        const mapping = {};
        /* eslint-disable array-callback-return */
        if(this.generateMapping) {
            mapping.name = this.mappingName;
            this.filteredTableData.items.map(item => {
                const newItem = {}
            this.filteredTableData.headers.map(header => {
                newItem[header.text] = item[header.value]
                if(!mapping[header.value]) {
                    mapping[header.value] = {}
                    mapping[header.value].new = header.text
                }
            })
                newJson.push(newItem)
            });
            this.mappings.push(mapping);
            this.updatedJson = newJson;
            this.showUpdatedJson = true;
            /* eslint-disable no-console */
            console.log("mapping", mapping)
        } else {
            this.filteredTableData.items.map(item => {
                const newItem = {}
            this.filteredTableData.headers.map(header => {
                newItem[header.text] = item[header.value]
            })
            newJson.push(newItem)
            });
            this.updatedJson = newJson;
            this.showUpdatedJson = true;
        }
        /* eslint-disable no-console */
        console.log(newJson)
    },
    doCopy() {
        this.$copyText(this.$refs.jsonData.innerText)
    },
    parseValue(val) {
      /* eslint-disable no-console */
      console.log("Vla", val)
      if(val === undefined) return ''
      return val.text
    },
    getData(item, index) {
      if(this.tableData.headers[index] === undefined) return ''
        const key = this.tableData.headers[index].text;
        /* eslint-disable no-console */
        console.log(item, index)
        return `${item[key]}`
    },
    filterHeaders() {
        this.filteredTableData.headers = this.filteredTableData.headers.filter(header => header.include === true)
    },
    clearFilterHeader() {
        this.filteredTableData.headers = [];
        /* eslint-disable no-return-assign */
          this.tableData.headers.map(header => {
             header.include = true;
             const newObj = Object.assign({}, header)
            this.filteredTableData.headers.push(newObj)
            return header;
        });
    },
    parsetToJson() {
      this.dataLoaded = true;
      this.rows = 1;
      const rows = this.rawData.split("\n");
      const headers = rows.shift().split("\t");
      this.tableData.headers = headers.map(header => ({ text: header, center: 'left', sortable: true, value: header, width: '30', include: true}));
      this.filteredTableData.headers = headers.map(header => ({ text: header, center: 'left', sortable: true, value: header, width: '30', include: true}));
      const jsonArr = [];
      /* eslint-disable no-console */
      console.log(headers);
      /* eslint-disable array-callback-return */
      rows.map(row => {
        const cells = row.split("\t");
        if (cells[0] === "") return;
        const obj = {};
        cells.forEach((element, index) => {
          obj[headers[index]] = element;
        });
        jsonArr.push(obj);
      });
      /* eslint-disable no-console */
      console.log("JSON Array", this.dataSet$);
      this.rawData = "";
      this.tableData.items = jsonArr;
      this.filteredTableData.items = [...jsonArr]
      outerSub$.next(jsonArr)
      console.log("OutterSUb", outerSub$.value)
    }
  }
};
</script>

<style scoped lang="scss">
    #excelPaste {
        padding: 10px;
    }
    .headerOptions {
        display: flex;
        align-items: center;
        padding: 10px;
        .headerTitle {
            flex-basis: 100%;
        }
    }

</style>