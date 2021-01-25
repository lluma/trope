import React, { useEffect, useState } from 'react';
import Video2Url from '../Data/video2url.json';
import Trope2Category from '../Data/trope2category.json';
import Tropes from '../Data/category.json';
import CONFIG from '../Utils/config';
import '../Css/MultipleChoicePaper.css'; 

/**
 * data format:
 * "data-video-sub": string;
    "data-video-tropename": string;
    "data-video-descrip": string;
    "data-video-name": string;
 */


const SubContent = ({ data }) => {
    return (
        <div>
            {(data['data-video-sub'] !== "")? 
                data['data-video-sub']:
                `"Subtitle" is not supported in this sample! Please choose another modal type.`}
        </div>
    );
};

const DescripContent = ({ data }) => {
    return (
        <div>
            {(data['data-video-descrip'] !== "")? 
                data['data-video-descrip']:
                `"Description" is not supported in this sample! Please choose another modal type.`}
        </div>
    );
};

const AudioContent = ({ data }) => {
    return (
        <div>
            <div id="audio_mask"></div>
            {(data['data-video-name'] !== "")? 
                (
                    <video width="640" height="480" controls>
                        <source src={Video2Url[data['data-video-name']]} type="video/mp4" />
                    </video>
                ):
                `"Audio" is not supported in this sample! Please choose another modal type.`}
        </div>
    );
};

const VideoContent = ({ data }) => {
    return (
        <div>
            {(data['data-video-name'] !== "")? 
                (
                    <video width="640" height="480" controls muted>
                        <source src={Video2Url[data['data-video-name']]} type="video/mp4" />
                    </video>
                ):
                `"Video" is not supported in this sample! Please choose another modal type.`}
        </div>
    );
};

export default ({ data, mainModal, handle_save_result_func, handle_close_paper_func }) => {

    const [ tempResult, setTempResult ] = useState({ ...data, ans: '' });
    const [ modal, setModal ] = useState(mainModal);
    const [ options, setOptions ] = useState([]);

    useEffect(() => {
        if ('options' in data && data['options'].length > 0) {
            setOptions(data['options']);
            setTempResult(data);
        }
        else {
            let new_options = sample_options(data['data-video-tropename']);
            setOptions(new_options);
            setTempResult({
                ...data,
                options: new_options,
                ans: ''
            });
        }
    }, [data]);

    const sample_options = (target_trope) => {

        function getRandomSubarray(arr, size) {
            var shuffled = arr.slice(0), i = arr.length, temp, index;
            while (i--) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled.slice(0, size);
        }

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
              let j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        let target_category = Trope2Category[target_trope];
        

        let options = [ target_trope ];
        let tropes_with_same_category = Tropes[target_category].filter((tr) => tr !== target_trope);
        let max_num_sample_from_same_category = Math.min(2, tropes_with_same_category.length);
        let same_catrgory_options = getRandomSubarray(tropes_with_same_category, max_num_sample_from_same_category);
        
        let other_categories = Object.keys(Tropes).filter((c) => c !== target_category);
        let sampled_categories = getRandomSubarray(other_categories, 2);
        let other_category_options = sampled_categories.map((c) => Tropes[c][Math.floor(Math.random() * Tropes[c].length)]);

        options = options.concat(same_catrgory_options);
        options = options.concat(other_category_options);
        return shuffle(options);
    }
    
    const choose_modal = (e, m) => {
        e.preventDefault();
        setModal(m);
    }

    const choose_option = (e, opt) => {
        if (tempResult['ans'] === opt) {
            setTempResult({
                ...tempResult,
                ans: ''
            });
        }
        else {
            setTempResult({
                ...tempResult,
                ans: opt
            });
        }
        
    }

    return (
        <div id="multimodal_paper"
            onClick={(e) => {
                e.preventDefault();
                if (e.target.id === 'multimodal_paper') {
                    handle_save_result_func(tempResult);
                    handle_close_paper_func(e);
                    
                    // let checkResult = checkValidateSaveResult();
                    // if (checkResult.success)  {
                    //     handle_close_paper_func(e);
                    //     handle_save_result_func(tempResult);
                    // }
                    // else
                    //     alert(checkResult.msg);
                }
            }}
        >
            <div id="paper_container">
                <div id="paper_container_row1">
                    <div id="paper_container_row1_title"><p>{`Test #${data.index + 1}`}</p></div>
                    <div id="modal_btn_group">
                        {CONFIG.MODAL_TYPES.map((m_type, m_type_idx) => {
                            let btn_className = (modal === m_type)? 'modal_btn_chosen':'modal_btn';
                            return (
                                <div 
                                    key={m_type_idx}
                                    className={btn_className}
                                    onClick={(e) => choose_modal(e, m_type)}
                                >
                                    {CONFIG.MODAL_NAMES[m_type_idx]}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div id="paper_container_row2">
                    <div id="paper_container_row2_content">
                        <div style={{ display: (modal === CONFIG.MODAL_TYPES[0])? 'flex': 'none'}}>
                            <SubContent data={data} />
                        </div>
                        <div style={{ display: (modal === CONFIG.MODAL_TYPES[1])? 'flex': 'none'}}>
                            <DescripContent data={data} />
                        </div>
                        <div style={{ display: (modal === CONFIG.MODAL_TYPES[2])? 'flex': 'none'}}>
                            <AudioContent data={data} />
                        </div>
                        <div style={{ display: (modal === CONFIG.MODAL_TYPES[3])? 'flex': 'none'}}>
                            <VideoContent data={data} />
                        </div>
                    </div>
                    <div id="paper_container_row2_trope_group">
                        {/* {sample_options(data['data-video-tropename'])} */}
                        {options.map((opt, opt_idx) => {
                            let className = "paper_container_row2_trope_box";
                            if (tempResult['ans'] === opt)
                                className = "paper_container_row2_trope_box_chosen";
                            return (
                                <div
                                    key={opt_idx}
                                    className={className}
                                    onClick={(e) => choose_option(e, opt)}
                                >
                                    {opt}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}