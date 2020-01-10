import React, { useState, useEffect, useRef } from 'react' ;
import 'highlight.js/styles/atom-one-dark.css'
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';

const QuestionContainer = ({ question, onClickReset, updateScore }) => {
  const { data = [] } = question;
  const [ curIndex, setCurIndex ] = useState( 0 );
  const [ curQuestion, setCurQuestion ] = useState( data[ curIndex ] );
  const [ isSelected, setIsSelected ] = useState( false );
  const [ btnText, setBtnText ] = useState( '다음문제' );
  const lastIndex = data.length - 1;
  const matchCount = useRef( 0 );

  useEffect( () => {
    hljs.registerLanguage( 'javascript', javascript );
    document.querySelectorAll( 'pre code' ).forEach( (block) => {
      hljs.highlightBlock( block );
    } );

  }, [ curQuestion ] );

  const onClick = (e) => {
    const { dataset: { select } } = e.target;

    setIsSelected( true );
    if( !select || isSelected ) {
      return;
    }

    if( +curQuestion.correct === +select ) {
      matchCount.current = matchCount.current + 1;
    } else {
      setCurQuestion( (curQuestion) => {

        const [ ...example ] = [ ...curQuestion.example ]
          .map( (example) => {
            if( +example.key === +select ) {
              return {
                ...example,
                correct: 'wrong',
              }
            }
            return example;
          } );

        return {
          ...curQuestion,
          example,
        }
      } );
    }
  };

  const onClickNext = () => {
    const nextIndex = curIndex + 1;

    if( lastIndex === nextIndex ) {
      setBtnText( '채점하기' );
    }

    if( lastIndex < curIndex + 1 ) {
      if( matchCount.current === data.length ) {
        alert( `만점!!` );
      } else {
        alert( `${ lastIndex + 1 }개 중 ${ matchCount.current }개 맞았습니다!` );
      }
      updateScore( matchCount.current / data.length * 100 );
      onClickReset();
      return;
    }

    setIsSelected( false );
    setCurIndex( nextIndex );
    setCurQuestion( data[ nextIndex ] );
  };

  return (
    <div className="question_container">
      <Question data={ curQuestion } onClick={ onClick } isSelect={ isSelected } onClickNext={ onClickNext }
                btnText={ btnText } lastIndex={ lastIndex } curIndex={ curIndex }/>
    </div>
  );
};

const Question = ({ data, onClick, isSelect, onClickNext, btnText, lastIndex, curIndex }) => {
  const { question, code, example } = data;
  return (
    <>
      <div className="question">
        💻 { `${ curIndex + 1 }/${ lastIndex + 1 }. ${ question }` }
      </div>
      <div className="code">
        <pre><code className="javascript">{ code }</code></pre>
      </div>
      <div className="answers">
        { example.map( (item) => {
          return (
            <div className={ `answer ${ isSelect ? item.correct : '' }` } data-select={ item.key }
                 key={ item.key } onClick={ onClick }>{ item.title }</div>
          );
        } ) }

          <div className="next">
          { isSelect &&
          <button className="next-btn" onClick={ onClickNext } data-reset={ btnText }>{ btnText }</button> }
        </div>
      </div>
    </>
  );
};

export default QuestionContainer;

