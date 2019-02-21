import React, { Component } from 'react';
import './App.css';

import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products_result: [],
      select1: '',
      select2: '',
      filtered_data: [],
      search_input: '',
      search_result: [],
      buttonId: 1
    };
    this.onChange = this.onChange.bind(this);
    this.runQuery = this.runQuery.bind(this);
    this.runSearch = this.runSearch.bind(this);
    this.setButton = this.setButton.bind(this);
}

  componentDidMount() {
    fetch("http://localhost:3003")
      .then(response => response.json())
        .then(json => {
          console.log('RESULT : ' + JSON.stringify(json.data));
          this.setState({ products_result: json.data})
          this.setState({ select1 : json.data[0].artikl_kategorija_opis})
          this.setState({ select2 : json.data[0].artikl_potkategorija_opis})
          console.log('STATE' + JSON.stringify(this.state.products_result))
        });
  }

  setButton(id){
    this.setState({buttonId: id});
    console.log('BUTTON ID ' + this.state.buttonId);
  }

  onChange (e) {
    this.setState({[e.target.name]: e.target.value });
    console.log(e.target.name);
    console.log(e.target.value);
  }

  runQuery() { 
    console.log('sending value');
    console.log('SELECT 1 -> ' + this.state.select1)
    console.log('SELECT 2 -> ' + this.state.select2);
    let param_a = this.state.select1;
    let param_b = this.state.select2;
    fetch(`http://localhost:3003/query/?q1=${param_a}&q2=${param_b}`)
      .then(response => response.json())
        .then(json => {
          //console.log('DATA' +  JSON.stringify(data.data));
          this.setState({
            filtered_data: json.data
          })
          console.log('FILTERED STATE' + JSON.stringify(this.state.filtered_data));
        })
  }

  runSearch() {
    console.log(this.state.search_input);
    let search_param = this.state.search_input;
    fetch(`http://localhost:3003/query_artikl_kljuc/?q1=${search_param}`)
      .then(response => response.json())
        .then(json => {
          //console.log('DATA' +  JSON.stringify(data.data));
          this.setState({
            search_result: json.data
          })
          console.log('SEARCH RESULT STATE' + JSON.stringify(this.state.search_result));
        })
  }

  render() {
    
    const button_value = this.state.buttonId;
    let state_by_button;
    if(button_value === 1 ) {
      state_by_button = this.state.filtered_data;
    }
    else if(button_value === 2) {
      state_by_button = this.state.search_result;
    }

    return (
      <div className="App">
        Artiklj kategorija:{" "}
        <select className="select_dropdown" name="select1" onChange={this.onChange}>
          {this.state.products_result.map(function(item, i){
            
            console.log(item);
            return <option key={i} value={item.artikl_kategorija_opis}>{item.artikl_kategorija_opis}</option>
          })}
        </select>

        Artikl podakategorija:{" "}
        <select className="select_dropdown" name="select2" onChange={this.onChange}>
          {this.state.products_result.map(function(item, i){
            console.log(item);
            return <option key={i} value={item.artikl_potkategorija_opis}>{item.artikl_potkategorija_opis}</option>
            
          })}
        </select>
        <button type="button" onClick={() => { this.runQuery(); this.setButton(1)}}>Run query</button>

        <InputGroup className="search_input">
          <InputGroup.Prepend>
            <Button variant="outline-secondary" onClick={() => { this.runSearch(); this.setButton(2)}}>Search</Button>
          </InputGroup.Prepend>
        <FormControl 
        placeholder="Unesi artikl ključ...." name="search_input" aria-describedby="basic-addon1" onChange={this.onChange} />
        </InputGroup>


          <Table className="table_results" striped bordered hover size="sm">
          <thead>
          <tr>
              <th>Artikl kategorija</th>
              <th>Artikl podkategorija</th>
              <th>Artikl kategorija sifra</th>
          </tr>
          </thead>
            <tbody>
              <tr>
                {state_by_button.map(function(item, i){
                  return ([
                    <td key={i} value={item.artikl_kategorija_opis}>{item.artikl_kategorija_opis}</td>,
                    <td key={i+1} value={item.artikl_potkategorija_opis}>{item.artikl_potkategorija_opis}</td>,
                    <td key={i+2} value={item.artikl_potkategorija_sifra}>{item.artikl_potkategorija_sifra}</td>
                  ])  
                })}
              </tr>
            </tbody>
          </Table>
      </div>
    );
  }
  
}

export default App;