import React, { useEffect, useState, useRef } from 'react';
import Doc from '../Data/tropes3.json';
import '../Css/AnnoPaper.css';

const isNumeric = (str) => {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
};

export default ({ data, result, handleClosePaperFunc, handleSaveResultFunc }) => {

    // console.log(data);
    // console.log(result);
    const inputRef = useRef(null);
    const [ tempResult, setTempResult ] = useState(() => ({
            title: 'Default',
            annotations: {}
    }));
    const [ tooltipStyle, setTooltipStyle ] = useState({});
    const [ tooltipContent, setTooltipContent ] = useState(false);

    const handleChooseTropeOption = (e, trope, opt) => {

        let newAnnotations = { ...tempResult.annotations };
        newAnnotations[trope] = { ...newAnnotations[trope], trope: trope, option: opt, evidences: [] };
        setTempResult(tempResult => ({
            ...tempResult,
            annotations: newAnnotations
        }));
    }

    const handleEnterEvidence = (e, trope) => {
        if (e.key === 'Enter') {
            let value = inputRef.current.value;
            let int_value = parseInt(value);
            let newAnnotations = { ...tempResult.annotations };
            let newEvidences = newAnnotations[trope].evidences;
            let index = newEvidences.indexOf(int_value);
            if (isNumeric(value) && index === -1 && int_value < (data.sentences.length + 1)) {
                newEvidences.push(int_value);
                newAnnotations[trope] = { ...newAnnotations[trope], trope: trope, evidences: newEvidences };
                setTempResult(tempResult => ({
                    ...tempResult,
                    annotations: newAnnotations
                }));
            }
            inputRef.current.value = '';
        }
    }

    const handleRemoveEvidence = (e, trope, value) => {
        let newAnnotations = { ...tempResult.annotations };
        let newEvidences = newAnnotations[trope].evidences;
        let index = newEvidences.indexOf(value);
        if (index !== -1) {
            newEvidences.splice(index, 1);
            newAnnotations[trope] = { ...newAnnotations[trope], trope: trope, evidences: newEvidences };
            setTempResult(tempResult => ({
                ...tempResult,
                annotations: newAnnotations
            }));
        }
    }
    
    const checkValidateSaveResult = () => {
        for (var trope in tempResult.annotations) {
            let annotation = tempResult.annotations[trope];
            if ((annotation.option === 'Match' || annotation.option === 'Similar') 
                && annotation.evidences.length === 0) 
                return {
                    success: false,
                    msg: `The evidences of trope "${trope}" cannot be empty!`
                };
        }
        return {
            success: true,
            msg: ''
        };
    }

    const handleChangeDefinition = (e, trope) => {
        
        // if (showDefintion && trope === tooltipContent.trope) setShowDefintion(false);
        // else {
            if (trope in Doc) {
                setTooltipStyle({
                    visibility: 'visible',
                    opacity: 1,
                    transition: 'opacity 0.3s'
                });
                let { category, sub_category, definition } = Doc[trope];
                setTooltipContent({
                    trope: trope,
                    category: category || '...',
                    sub_category: sub_category || '...', 
                    definition: definition
                });
            }
            else {
                setTooltipStyle({});
            }
        // }
    }

    useEffect(() => {
        setTempResult(result);
    }, [result])

    return (
        <div id="anno_paper"
            onClick={(e) => {
                e.preventDefault();
                if (e.target.id === 'anno_paper') {
                    
                    let checkResult = checkValidateSaveResult();
                    if (checkResult.success)  {
                        handleClosePaperFunc(e);
                        handleSaveResultFunc(tempResult);
                    }
                    else
                        alert(checkResult.msg);
                }
            }}
        >
            <div 
                id="paper_container"
                
            >
                <div id="paper_container_row1">
                    <div id="paper_container_row1_title"><p>{`${data.idx}. ${data.title}`}</p></div>
                    <div 
                        id="paper_container_row1_trope_tooltip"
                        style={tooltipStyle}
                    >
                        <p id="paper_container_row1_trope_tooltip_title">
                            {`${tooltipContent.trope}`}
                        </p>
                        <p id="paper_container_row1_trope_tooltip_subtitle">
                            {`[ ${tooltipContent.category} / ${tooltipContent.sub_category} ]`}
                        </p>
                        <p id="paper_container_row1_trope_tooltip_content">{tooltipContent.definition}</p>
                    </div>
                </div>
                <div id="paper_container_row2">
                    <div id="paper_container_row2_corpus_content">
                        {data.sentences.map((sent, sent_idx) => (
                            <div 
                                className="paper_container_row2_corpus_sentence_box"
                                key={sent_idx+1}
                            >
                                <div className="paper_container_row2_corpus_sentence_index">{sent_idx+1}</div>
                                <div className="paper_container_row2_corpus_sentence">{sent}</div>
                            </div>
                        ))}
                    </div>
                    <div id="paper_container_row2_trope_group">
                        {data.tropeOptions.map((trope, trope_idx) => (
                            <div 
                                className="paper_container_row2_trope_box"
                                key={trope_idx}
                                
                            >
                                <div 
                                    className="paper_container_row2_trope_title"
                                    // onClick={(e) => handleShowDefinition(e, trope)}
                                    onMouseOver={(e) => handleChangeDefinition(e, trope)}
                                    onMouseOut={() => { setTooltipStyle({
                                        opacity: 0,
                                        transition: 'opacity 1.0s'
                                    })}}
                                >
                                    {trope}
                                </div>
                                <div className="paper_container_row2_trope_option_group">
                                    {['Match', 'Similar', 'None'].map((opt, opt_idx) => {
                                        let selected_style = (trope in tempResult.annotations && tempResult.annotations[trope].option === opt)? 
                                            { backgroundColor: ' rgb(151, 151, 126)' }:{};
                                        return (
                                            <div 
                                                className="paper_container_row2_trope_option"
                                                key={opt_idx}
                                                style={selected_style}
                                                onClick={(e) => handleChooseTropeOption(e, trope, opt)}
                                            >
                                                {opt}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="paper_container_row2_trope_evidence_group">
                                    {trope in tempResult.annotations && (tempResult.annotations[trope].option === "Match" || tempResult.annotations[trope].option === "Similar")
                                    && (
                                        <React.Fragment>
                                            
                                            <div className="paper_container_row2_trope_evidence_input_wrapper">
                                                <input 
                                                    ref={inputRef}
                                                    className="paper_container_row2_trope_evidence_input"
                                                    placeholder="index"
                                                    onKeyDown={(e) => handleEnterEvidence(e, trope)}
                                                />
                                            </div>
                                            {tempResult.annotations 
                                            && trope in tempResult.annotations 
                                            && tempResult.annotations[trope].evidences.map((sent_line_idx, evidence_idx) => (
                                                <div 
                                                    key={evidence_idx}
                                                    className="paper_container_row2_trope_evidence"
                                                    onClick={(e) => handleRemoveEvidence(e, trope, sent_line_idx)}
                                                >
                                                    {sent_line_idx}
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    )}
                                </div>
                                <div className="paper_container_row2_trope_box_line"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            
        </div>
    );
}