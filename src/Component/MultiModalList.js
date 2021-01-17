import React, { useState } from 'react';
import TestData from '../Data/newtest_trope10.json';
import MultipleChoicePaper from './MultipleChoicePaper';
import '../Css/MultiModalList.css';

export default () => {

    const [ data, setData ] = useState({});
    const [ multiModalPaperDisplay, setMultiModalPaperDisplay ] = useState(false);
    const [ result, setResult ] = useState(TestData.map((cur, cur_idx) => {
        return { ...cur, index: cur_idx, options: [], ans: '' };
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

    return (
        <div>
            <div id="multimodal_list">
                <div id="multimodal_list_title">Trope Annotation - MultiModal</div>
                <div id="multimodal_list_content">
                    {TestData.map((item, item_idx) => {
                        let item_style = {};
                        if (result[item_idx]['ans'] !== '')
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
                    handle_save_result_func={handle_save_result}
                    handle_close_paper_func={handle_close_paper}
                />
            }
        </div>
    );
}