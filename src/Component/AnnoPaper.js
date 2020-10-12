import React, { useEffect, useState, useRef } from 'react';
import '../Css/AnnoPaper.css';

export default ({ data, result, handleClosePaperFunc, handleSaveResultFunc }) => {

    // console.log(data);
    // console.log(result);
    const inputRef = useRef(null);
    const [ tempResult, setTempResult ] = useState(() => ({
            title: 'Default',
            annotations: {}
    }));

    const handleChooseTropeOption = (e, trope, opt) => {

        let newAnnotations = { ...tempResult.annotations };
        newAnnotations[trope] = { trope: trope, option: opt };
        setTempResult(tempResult => ({
            ...tempResult,
            annotations: newAnnotations
        }));
    }

    const handleEnterEvidence = (e, trope) => {
        if (e.key === 'Enter') {
            console.log(inputRef.current.value);
        }
    }
    
    useEffect(() => {
        setTempResult(result);
    }, [result])

    return (
        <div id="anno_paper"
            onClick={(e) => {
                e.preventDefault();
                if (e.target.id === 'anno_paper') {
                    handleClosePaperFunc(e);
                    handleSaveResultFunc(tempResult);
                }
            }}
        >
            <div 
                id="paper_container"
                
            >
                <div id="paper_container_row1">
                    <p id="paper_container_row1_title">{`${data.idx}. ${data.title}`}</p>
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
                                <div className="paper_container_row2_trope_title">
                                    {trope}
                                </div>
                                <div className="paper_container_row2_trope_option_group">
                                    {['Match', 'Similar', 'None'].map((opt, opt_idx) => {
                                        let selected_style = (trope in tempResult.annotations && tempResult.annotations[trope].option === opt)? 
                                            { backgroundColor: 'green' }:{};
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
                                    && <input 
                                        ref={inputRef}
                                        className="paper_container_row2_trope_evidence_input"
                                        placeholder="index"
                                        onKeyDown={(e) => handleEnterEvidence(e, trope)}
                                    />}
                                    
                                    <div></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            
        </div>
    );
}