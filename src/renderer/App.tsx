import React from 'react';
import { IAppProcess } from 'src/main/interfaces/IAppProcess';
import { IAppProcessLog } from 'src/main/interfaces/IAppProcessLog';
import { IAppStorage } from 'src/main/interfaces/IAppStorage';
import AuthenticationPage from './AuthenticationPage';
import MainPage from './MainPage';

export default class App extends React.Component<any, {
    isLoading: boolean,
    storage: IAppStorage,
    process?: IAppProcess,
    log: IAppProcessLog[]
}> {
    constructor(props) {
        super(props);

        this.state = {
            log: [],
            ...window.api.init({
                onUpdateIsLoading: (isLoading) => this.setState({ isLoading }),
                onUpdateStorage: (storage) => this.setState({ storage }),
                onUpdateProcess: (process, log) => {
                    this.setState({ process, log: log ? [log, ...this.state.log].slice(0, 5) : this.state.log })
                },
                onMessage: (message: string, isError: boolean) => {
                    alert(isError ? `Error : ${message}` : message)
                }
            })
        }
    }

    render() {

        return (
            <div id="root">
                {this.state.storage.session_token
                    ? <MainPage
                        isLoading={this.state.isLoading}
                        storage={this.state.storage}
                        process={this.state.process}
                        log={this.state.log}
                    /> : <AuthenticationPage
                        isLoading={this.state.isLoading}
                        storage={this.state.storage}
                    />}
            </div>
        );
    }
}