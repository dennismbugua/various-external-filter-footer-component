import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";
import matchSorter from 'match-sorter'

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

import DatePicker from 'react-bootstrap-date-picker';

// smart component - although no real smarts in this - just for testing
class Over21 extends React.Component {
  render()
  {
    return (
      <span>{this.props.value >= 21 ? "Yes" : "No"}</span>
    )
  }
}

// pure component
const AllUpperCase = props => <span>{props.value.toUpperCase()}</span>;


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: makeData(200),
      filtered: [],
      filterAll: '',
    };
    this.filterAll = this.filterAll.bind(this);
  }

  onFilteredChange(filtered) {
    // console.log('filtered:',filtered);
    // const { sortedData } = this.reactTable.getResolvedState();
    // console.log('sortedData:', sortedData);

    // extra check for the "filterAll"
    if (filtered.length > 1 && this.state.filterAll.length) {
      // NOTE: this removes any FILTER ALL filter
      const filterAll = '';
      this.setState({ filtered: filtered.filter((item) => item.id != 'all'), filterAll })
    }
    else
      this.setState({ filtered });
  }

  filterAll(e) {
    const { value } = e.target;
    const filterAll = value;
    const filtered = [{ id: 'all', value: filterAll }];
    // NOTE: this completely clears any COLUMN filters
    this.setState({ filterAll, filtered });
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        Filter All: <input value={this.state.filterAll} onChange={this.filterAll} />
        <ReactTable

          TfootComponent={
            ({ children, className, ...rest }) =>
              <div className={className} {...rest} style={{ backgroundColor: "#F00", color: "#FFF" }}>
                My Footer - anything can go here
              </div>
          }

          getTrProps={(state,rowInfo)=>{

          }}

          filtered={this.state.filtered}

          ref={r => this.reactTable = r}
          onFilteredChange={this.onFilteredChange.bind(this)}

          data={data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          columns={[
            // {
            //   Header: 'Record Number',
            //   id: 'recordNumber',
            //   accessor: d=>Number(d.recordNumber),
            // },
            // {
            //   Header:"Child1Name",
            //   id:'child1name',
            //   accessor:'children[0].firstName'
            // },
            // this is basically just from the CUSTOMER FILTER demo
            {
              Header: "Name",
              columns: [
                {
                  Header: "First Name",
                  accessor: "firstName",
                  // Filter: ()=>{
                  //   return <DatePicker />
                  // },
                  filterMethod: (filter, row) => {
                    return row[filter.id].includes(filter.value);
                  }
                },
                {
                  Header: "Last Name",
                  id: "lastName",
                  accessor: d => d.lastName,
                  Cell: ({value}) => <AllUpperCase value={value} />,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["lastName"] }),
                  filterAll: true
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Age",
                  accessor: "age"
                },
                {
                  Header: "Over 21",
                  Footer: "Anything here - just for forcing the TfootComponent to render",
                  accessor: "age",
                  id: "over",
                  Cell: ({value}) => <Over21 value={value} />,
                  filterMethod: (filter, row) => {
                    if (filter.value === "all") {
                      return true;
                    }
                    if (filter.value === "true") {
                      return row[filter.id] >= 21;
                    }
                    return row[filter.id] < 21;
                  },
                  Filter: ({ filter, onChange }) =>
                    <select
                      onChange={event => onChange(event.target.value)}
                      style={{ width: "100%" }}
                      value={filter ? filter.value : "all"}
                    >
                      <option value="all">Show All</option>
                      <option value="true">Can Drink</option>
                      <option value="false">Can't Drink</option>
                    </select>
                }
              ]
            },
            {
              // NOTE - this is a "filter all" DUMMY column
              // you can't HIDE it because then it wont FILTER
              // but it has a size of ZERO with no RESIZE and the
              // FILTER component is NULL (it adds a little to the front)
              // You culd possibly move it to the end
              Header: "All",
              id: 'all',
              width: 0,
              resizable: false,
              sortable: false,
              Filter: () => { },
              getProps: () => {
                return {
                  // style: { padding: "0px"}
                }
              },
              filterMethod: (filter, rows) => {
                // using match-sorter
                // it will take the content entered into the "filter"
                // and search for it in EITHER the firstName or lastName
                const result = matchSorter(rows, filter.value, {
                  keys: [
                    "firstName",
                    "lastName"
                  ], threshold: matchSorter.rankings.WORD_STARTS_WITH
                });
                console.log('row[0]:', result[0]);
                return result;
              },
              filterAll: true,
            },

          ]}
          defaultPageSize={10}
          className="-striped -highlight"

          getTrProps={(state,rowInfo)=>{ 
            // console.log('original:',rowInfo.original);
            // console.log('row:',rowInfo.row);
            // console.log('row.firstName:',rowInfo.row.firstName);
            // console.log('original.children:',rowInfo.original.children);
            return {} 
          }}
        />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
