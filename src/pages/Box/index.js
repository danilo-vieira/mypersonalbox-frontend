import React, { Component } from 'react';
import api from '../../services/api';
import { formatDistance, parseISO } from 'date-fns'; // https://date-fns.org/v2.0.0-alpha.27/docs
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import { MdInsertDriveFile } from 'react-icons/md'

import './styles.css';

export default class Box extends Component {
  state = {
    box: { }
  }
  // DidMount é disparado de forma automatica quando o componente é renderizado
  async  componentDidMount() {
    this.subscribeToNewFiles();

    const box = this.props.match.params.id;
    const response = await api.get(`boxes/${box}`);

    this.setState({ box: response.data })
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket('https://omnistackweek6-backend.herokuapp.com');

    io.emit('connectRoom', box);

    io.on('file', data => {
      this.setState({
        box: { ...this.state.box,  files: [data, ...this.state.box.files] }
      });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;

      data.append('file', file);

      api.post(`boxes/${box}/files`, data);
    })
  }

  render() {
    return (
      <div id="box-container">
        <header>
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />

              <p>Arraste arquivos ou clique aqui para fazer upload</p>
            </div>
          )}
        </Dropzone>
        <ul>

          {/* Se existir arquivo, o map é rodado */}
          { this.state.box.files && this.state.box.files.map(file => (
            <li key={file._id}>
              <a className="fileInfo" href={file.url} target="_blank" rel="noopener noreferrer">
                <MdInsertDriveFile size={24} color="#26BF91" />
                <strong>{file.title}</strong>
              </a>
              <span>Há{" "}
                {formatDistance(parseISO(file.createdAt), new Date(), {
                  locale: pt
                })}
              </span>
            </li>

          )) }

        </ul>
      </div>
    ); // file.createdAt, new Date()
  }
}
