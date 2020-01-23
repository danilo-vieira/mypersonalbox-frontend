import React, { Component } from 'react';
import api from '../../services/api';

import './styles.css';

export default class Main extends Component { // No state, toda vez que há uma alteração no codigo, o render() vai executar novamente
  state = {
    newBox: '',
  };

  handleSubmit = async (event) => {
    // Previne que o form faça seu comportamento padrão que é atualizar
    // ou direcionar para outra página
    event.preventDefault();

    const response = await api.post('boxes', {
      title: this.state.newBox,
    });
    console.log(response)
    this.props.history.push(`/box/${response.data._id}`);
  };

  handleInputChange = (event) => {
    this.setState({ newBox: event.target.value });
  };

  render() {
    return (
      <div id="main-container">
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="Digite o nome do diretório"
            value={this.state.newBox}
            onChange={this.handleInputChange}
          />
          <button type="submit">Criar</button>
        </form>
      </div>
    );
  }
}
