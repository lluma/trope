import React, { useState } from 'react';
import Corpus from '../Data/plots4amt.json';
import Tropes from '../Data/tropes4amt_sampled.json';
import AnnoPaper from './AnnoPaper';
import '../Css/CorpusList.css';

const IGNORE_CORPUS = [
    'MissionImpossibleII',
    'MarleyAndMe',
    'DeadSpaceDownfall',
    'CoolRunnings',
    'SmallTimeCrooks',
    'MoonOverMiami',
    'FuneralInBerlin',
    'TheChangeling',
    'MurderParty',
    'Ararat',
    'WeWereSoldiers',
    'ExitWounds',
    'ItHappenedHere',
    'TheMusicMan',
    'SnowCake',
    'BlackSea',
    'BlackSnakeMoan',
    'Anaconda',
    'TheIncredibleShrinkingMan',
    'TheGingerdeadMan',
    'ShadowOfADoubt'
];

// console.log(Corpus);
// console.log(Tropes);

export default () => {

    const [ data, setData ] = useState(() => {
        return {
            title: 'Default',
            idx: 1,
            sentences: ['xxxxx','xxxxxxx', 'xxxxxxxxxxxx'],
            tropeOptions: ['oooo','ooooooo','ooo']
        };
    });
    const [ result, setResult ] = useState(() => Object.keys(Corpus).reduce((res, cur) => {
        if (cur in res) console.error('Same key error occurred in Corpus! [' + cur + ']');
        else res[cur] = { 
                title: cur, 
                annotations: {}
                // annotations:  Tropes[cur].reduce((ta, tr) => {
                //     if (tr in ta) console.error('Same key error occurred in Tropes! [' + tr + ']');
                //     else ta[tr] = { trope: tr, option: '', evidence: [] };
                //     return ta;
                // }, {})
            };
        return res;
    }, {}));
    const [ annoPaperDisplay, setAnnoPaperDisplay ] = useState(false);

    const handleChooseCorpus = (e, newData) => {
        e.preventDefault();
        setData(newData);
        setAnnoPaperDisplay(true);
    }

    const handleClosePaper = (e) => {
        setAnnoPaperDisplay(false);
    }

    const handleSaveResult = (saveResult) => {
        let { title, annotations } = saveResult;
        let newResult = { ...result };
        newResult[title].annotations = {
            ...newResult[title].annotations,
            ...annotations
        };
        // console.log(saveResult);
        // console.log(newResult);
        setResult(newResult);
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

    const handleLoadFromFile = (e) => {

        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            setResult(JSON.parse(e.target.result));
        };
    }

    return (
        <React.Fragment>
            <div id="corpus_list">
                <div id="corpus_list_title">Trope Annotation</div>
                <div id="corpus_list_content">
                    {Object.keys(Corpus).map((title, title_idx) => {
                        if (IGNORE_CORPUS.includes(title)) return null;
                        let tropes = Tropes[title];
                        let completed_style = {};
                        let completed_annotations = Object.keys(result[title].annotations);
                        if (completed_annotations.length === tropes.length) 
                            completed_style = { backgroundColor: 'green' };
                        return (
                            <div 
                                className="corpus_list_item" 
                                key={title_idx+1}
                                style={completed_style}
                                onClick={(e) => handleChooseCorpus(e, {
                                    title: title,
                                    idx: title_idx + 1,
                                    sentences: Object.keys(Corpus[title]).map((line) => Corpus[title][line]),
                                    tropeOptions: Tropes[title]
                                })}
                            >
                                <span className="corpus_list_item_title"><p>{`${title_idx+1}. ${title}`}</p></span>
                                <span className="corpus_list_item_status">
                                    {completed_annotations.length}/{tropes.length}
                                </span>
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
            {annoPaperDisplay 
                && <AnnoPaper 
                    data={data}
                    result={result[data.title]}
                    handleClosePaperFunc={handleClosePaper}
                    handleSaveResultFunc={handleSaveResult}
                />
            }
            
        </React.Fragment>
    );
}