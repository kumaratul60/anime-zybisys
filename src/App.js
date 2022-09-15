import React from "react";
import Avatar from "@mui/material/Avatar";
import MUIDataTable from "mui-datatables";

import "./App.css";

import { Button } from "@mui/material";

const columns = [
  { name: "title" },
  {
    name: "images",
    options: {
      customBodyRender: (params) => {
        return <Avatar variant="rounded" src={ params.jpg.image_url }></Avatar>;
      },
    },
  },
  { name: "rating" },
];

let allRows, makeRow, count = 0;

const options = {
  filterType: "dropdown",
  responsive: "standard",

  onRowSelectionChange: (curRowSelected, allRowsSelected, RowSelect) => {
    makeRow = RowSelect;
    console.log(makeRow);
  },
};

const addToWatchList = (e) => {
  e.preventDefault();
  makeRow.map((row) => {
    localStorage.setItem(count, allRows[row]);
    count++;
  });
  alert("Items Added to the Watch list");
  window.location.reload();
};

async function getData(path) {
  const res = await fetch(path);
  const results = await res.json();
  let temp = results.data;
  return temp.map((row) => {
    return columns.map((column) => {
      return row[column.name] || "";
    });
  });
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      counter: 0,
    };
  }

  async componentDidMount() {
    var data = await getData("https://api.jikan.moe/v4/anime");

    this.setState({ results: data });
    allRows = this.state.results;
  }

  render() {
    return (
      <div>
        <h1 style={ { textAlign: "center" } }>
          Zybisys test
          <hr></hr>
        </h1>
        <div>
          <Button
            style={ {
              background: "cyan",
              color: "black",
              display: "block",
              left: "88%",
              margin: 5,
            } }
            onClick={ addToWatchList }
          >
            Add To Watch list
          </Button>
          <MUIDataTable
            title={ "Anime List" }
            data={ this.state.results }
            columns={ columns }
            options={ options }
          />
        </div>

        <div className="watchList">
          <h2 style={ { textAlign: "center" } }>
            Add Avatar to watch list <br></br>
            <hr></hr>
          </h2>

          { Object.keys(localStorage).map((item, idx) => {
            return <span className="watchListItem" key={ idx }>{ localStorage[item] }</span>;
          }) }
        </div>
      </div>
    );
  }
}
