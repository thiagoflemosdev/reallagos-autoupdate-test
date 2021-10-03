import React from 'react';
import { IAppStorage } from 'src/main/interfaces/IAppStorage';

export default class AuthenticationPage extends React.Component<{
    isLoading: boolean,
    storage: IAppStorage
}> {
    render() {
        return this.props.isLoading ? <div>Loading...</div> : (
            <div>
                Insert the device code
                <input id="code-input" type="text" ></input>
                <button onClick={(event) => {
                    event.preventDefault()
                    const input = document.getElementById("code-input") as HTMLInputElement
                    
                    if(input.value) {
                        window.api.auth(input.value)
                    }
                }}>Submit</button>
            </div>
        );
    }
}

