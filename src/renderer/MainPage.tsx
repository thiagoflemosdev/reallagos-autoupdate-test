import React from 'react';
import { IAppProcess } from 'src/main/interfaces/IAppProcess';
import { IAppStorage } from 'src/main/interfaces/IAppStorage';
import DatePicker from "react-datepicker";
import { IAppProcessLog } from 'src/main/interfaces/IAppProcessLog';

export default class MainPage extends React.Component<{
    isLoading: boolean,
    storage: IAppStorage,
    process: IAppProcess,
    log: IAppProcessLog[]
}> {
    render() {

        return (
            <div>
                <div>v1.0.2</div>
                {this.props.isLoading && <div>Loading...</div>}
                <h2>Reallagos</h2>

                <h3>Info</h3>
                <div>
                    <div>uuid: {this.props.storage.device_info.uuid}</div>
                    <div>description: {this.props.storage.device_info.description}</div>
                    <div>client: {this.props.storage.device_info.client.name}</div>
                    {this.props.process && !!this.props.process.uploadQueue && !this.props.process.uploading && <div>{this.props.process.uploadQueue} files to upload</div>}
                    {this.props.process && !!this.props.process.uploadQueue && !!this.props.process.uploading && <div>uploading <b>{this.props.process.uploading}</b> of {this.props.process.uploadQueue} files to upload</div>}
                </div>

                <h3>Upload Date</h3>
                {!this.props.storage.upload_timestamp && <div style={{ color: "#DD2222" }}>Select from what date the files should upload</div>}

                <div>
                    Uploaded files up to
                    <DatePicker
                        dateFormat="Pp"
                        showTimeSelect
                        selected={this.props.storage.upload_timestamp && new Date(this.props.storage.upload_timestamp)}
                        onChange={(date: Date) => { window.api.updateUploadTimestamp(date.toISOString()) }} />
                </div>

                <h3>Folders</h3>
                {this.props.storage.settings.watchPaths.map((v, i) =>
                    <div key={i}>{v}</div>
                )}


                <h3>Log</h3>
                {this.props.log.map((v, i) =>
                    <div style={{ color: v.isError ? "#DD2222" : "#333333", fontStyle: "italic" }} key={i}>{v.message} <b>{new Date(v.timestamp).toISOString()}</b></div>
                )}

                <h3>Actions</h3>
                <div>
                    <button disabled={this.props.isLoading} onClick={(e) => {
                        e.preventDefault()
                        window.api.updateWatchPaths()
                    }}>Select Folders</button>
                    <button onClick={() => {
                        window.api.resetStorage()
                    }}>Reset Storage</button>
                </div>
            </div>
        );
    }
}

