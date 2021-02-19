import React, { useState } from 'react';
import TestData from '../Data/newtest_trope10_with_options.json';
import MultipleChoicePaper from './MultipleChoicePaper';
import CONFIG from '../Utils/config';
import '../Css/MultiModalList.css';

const removeEmptyData = (test_data) => {
    // return test_data.filter((d) => d['data-video-sub'] !== "" 
    //     && d['data-video-tropename'] !== "" 
    //     && d['data-video-descrip'] !== ""
    //     && d['data-video-name'] !== "");
    return test_data; // Current version return original full data.
}

export default () => {

    const [ data, setData ] = useState({});
    const [ mainModal, setMainModal ] = useState(CONFIG.MODAL_TYPES[0]);
    const [ multiModalPaperDisplay, setMultiModalPaperDisplay ] = useState(false);
    const [ result, setResult ] = useState(removeEmptyData(TestData).map((cur, cur_idx) => {
        return { ...cur, index: cur_idx, ans: '', conf: -1 };
    }));

    const handle_choose_data = (e, newData) => {
        e.preventDefault();
        setData(newData);
        setMultiModalPaperDisplay(true);
    }

    const handle_save_result = (saveResult) => {
        
        let newResult = result;
        newResult[saveResult.index] = saveResult;
        setResult(newResult);
    }

    const handle_close_paper = (e) => {
        setMultiModalPaperDisplay(false);
    }

    const handleLoadFromFile = (e) => {
        
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            setResult(JSON.parse(e.target.result));
        };
    }

    const handleSave2File = () => {

        async function download(content, fileName, contentType) {
            
            const json = JSON.stringify(content);
            const blob = new Blob([json],{type: contentType});
            const href = await URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = fileName + ".json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        download(result, 'test', 'application/json');
    }

    const chooseMainModal = (e, m) => {
        e.preventDefault();
        setMainModal(m);
    }

    return (
        <div>
            <div id="multimodal_list">
                <div id="multimodal_list_title">Trope Annotation - MultiModal</div>
                <div id="multimodal_list_modal_btn_group">
                    {CONFIG.MODAL_TYPES.map((m_type, m_type_idx) => {
                        let btn_className = (mainModal === m_type)? 'multimodal_list_modal_btn_chosen':'multimodal_list_modal_btn';
                        return (
                            <div 
                                className={btn_className}
                                onClick={(e) => chooseMainModal(e, m_type)}
                            >
                                {CONFIG.MODAL_NAMES[m_type_idx]}
                            </div>
                        );
                    })}
                </div>
                <div id="multimodal_list_content">
                    {removeEmptyData(TestData).map((item, item_idx) => {
                        let item_style = {};
                        if (result[item_idx]['ans'] !== '' && result[item_idx]['conf'] >= 0)
                            item_style = { "background": "green" };

                        return (
                            <div
                                key={item_idx}
                                style={item_style}
                                className="multimodal_list_item"
                                onClick={(e) => handle_choose_data(e, {
                                    ...item,
                                    index: item_idx
                                })}
                            >
                                Test #{item_idx+1}
                            </div>
                        );
                    })}
                </div>
                <div id="btn_group">
                    <div id="load_btn">
                        <input type="file" onChange={handleLoadFromFile} />
                    </div>
                    <div id="save_btn" onClick={handleSave2File}><p>Save</p></div>
                </div>
            </div>
            {multiModalPaperDisplay && 
                <MultipleChoicePaper 
                    data={result[data['index']]}
                    mainModal={mainModal}
                    handle_save_result_func={handle_save_result}
                    handle_close_paper_func={handle_close_paper}
                />
            }
        </div>
    );
}