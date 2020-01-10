import React, { useState, useEffect, useRef } from 'react' ;
import './css/reset.css';
import './css/style.css';
import questions from "./data/questions";
import QuestionContainer from "./QuestionContainer";
import Store from "./Store";
import LevelContainer from "./LevelContainer";
import QuestionListContainer from "./QuestionListContainer";

const MAIN = 0;
const QUESTION_LIST = 1;
const QUESTION = 2;
const TITLE = '자바스크립트 문제 은행';
const LOCAL_STORAGE_KEY = 'quizScores';

const Main = () => {
  const [ index, setIndex ] = useState( MAIN );
  const [ level, setLevel ] = useState( '' );
  const [ order, setOrder ] = useState( null );
  const [ title, setTitle ] = useState( TITLE );
  const scoresLocalStorage = useRef( new Store( LOCAL_STORAGE_KEY ) );
  const [ scores, setScores ] = useState( [] );

  const getScore = (name) => {
    return scoresLocalStorage.current.getLocalStorage( name );
  };

  const setScore = (name, item) => {
    scoresLocalStorage.current.setLocalStorage( name, item );
  };

  useEffect( () => {
    const scores = getScore( LOCAL_STORAGE_KEY );

    if( level && !scores[ level ] ) {
      scores[ level ] = [];
      setScore( LOCAL_STORAGE_KEY, scores );
    }

    setScores( scores[ level ] );
  }, [ level ] );

  const updateScore = (score) => {
    const scores = getScore( LOCAL_STORAGE_KEY );
    if( !scores[ level ] || order === null ) {
      scores[ level ] = [];
    }

    scores[ level ][ order ] = score;
    setScore( LOCAL_STORAGE_KEY, scores );
    setScores( scores[ level ] );
  };

  const onClickStart = (e) => {
    const { dataset: { level } } = e.target;
    setIndex( QUESTION_LIST );
    setLevel( level );
  };

  const onClickLevelTestStart = (e) => {
    const { dataset: { order } } = e.target;
    setIndex( QUESTION );
    setOrder( order );
    setTitle( questions[ level ][ order ].name );
  };

  const onClickReset = () => {
    setIndex( QUESTION_LIST );
    setLevel( level );
    setTitle( TITLE );
    setOrder( null );
  };

  const onClickMain = () => {
    setIndex( MAIN );
  };

  const onClickScoreReset = () => {
    updateScore( 0 );
  };

  return (
    <Container>
      <Header title={ title } index={ index } onClickScoreReset={ onClickScoreReset }/>
      <Contents index={ index }>
        <LevelContainer onClick={ onClickStart }/>
        <QuestionListContainer questionList={ questions[ level ] } onClick={ onClickLevelTestStart }
                               quizScores={ scores } onClickMain={ onClickMain }/>
        <QuestionContainer question={ questions[ level ] && questions[ level ][ order ] }
                           onClickReset={ onClickReset } updateScore={ updateScore }/>
      </Contents>
    </Container>
  );
};

const Container = ({ children }) => {
  return (
    <div className="container">
      { children }
    </div>
  );
};

const Contents = ({ index, children }) => {
  return React.Children.map( children, (child, childIndex) => {
    if( index === childIndex ) {
      return child;
    }
  } );
};

const Header = ({ title, index, onClickScoreReset }) => {
  return (
    <div className="header">
      <h2 className="title">
        { title }
      </h2>
      { index === QUESTION_LIST && (<button className="btn btn-reset" onClick={ onClickScoreReset }>점수 초기화</button>) }
    </div>
  );
};

export default Main;
