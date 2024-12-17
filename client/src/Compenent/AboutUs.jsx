import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import paymentsPic from '../Pictures/money-management.png';
import messagesPic from '../Pictures/comments.png';
import balancePic from '../Pictures/balance-sheet.png';
import managementPic from '../Pictures/infrastructure.png';
import statementPic from '../Pictures/statement.png';
import '../CSS/AboutUs.css'; 

const App = () => {
  // State to trigger the animation
  const [show, setShow] = useState(false);

  // Trigger the transition after the component mounts
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <>
      <table>
        <tbody>
          <tr>
            {/* Left Slide-in Div */}
            <td>
              <CSSTransition
                in={show}
                appear={true}
                timeout={1000}
                classNames="slide-right"
              >
                <div className="slide-box rigth">
                  <img src={paymentsPic} width={'100px'} />
                  <h4>תשלומים</h4>
                  <h6>בכל רגע נתון ניתן לבצע תשלומים דרך האתר, לתשלום הוועד וכן תשלומים מיוחדים...</h6>
                </div>
              </CSSTransition>
            </td>

            {/* Right Slide-in Div */}
            <td>
              <CSSTransition
                in={show}
                appear={true}
                timeout={1000}
                classNames="slide-left"
              >
                <div className="slide-box left">
                  <img src={messagesPic} width={'100px'} />
                  <h4>הודעות</h4>
                  <h6>קיימת מערכת הודעות אשר באמצעותה ניתן לשלוח ולקבל הודעות משכן לשכן וכן לתקשר עם הוועד...</h6>
                </div>
              </CSSTransition>
            </td>
          </tr>

          <tr>
            {/* Left Slide-in Div */}
            <td>
              <CSSTransition
                in={show}
                appear={true}
                timeout={1000}
                classNames="slide-right"
              >
                <div className="slide-box right">
                  <img src={balancePic} width={'100px'} />
                  <h4>שקיפות</h4>
                  <h6>כל דייר יכל בכל רגע נתון להיכנס למערכת ולצפות ביתרה וכן בהוצאות והכנסות...</h6>
                </div>
              </CSSTransition>
            </td>

            {/* Right Slide-in Div */}
            <td>
              <CSSTransition
                in={show}
                appear={true}
                timeout={1000}
                classNames="slide-left"
              >
                <div className="slide-box left">
                  <img src={statementPic} width={'100px'} />
                  <h4>דוחות</h4>
                  <h6>המערכת שולחת באופן אוטומטי דוחות חודשיים באופן פרטני דרך מגוון פלטפורמות לבחירה...</h6>
                </div>
              </CSSTransition>
            </td>

          </tr>

          <tr>
            {/* Single Div */}
            <td>
            <CSSTransition
                in={show}
                appear={true}
                timeout={1000}
                classNames="slide-right"
              >
              <div className="slide-box right">
                <img src={managementPic} width={'100px'} />
                <h4>ניהול הבניין</h4>
                <h6>האתר מציע ממשק ניהול, המאפשר לוועד לעדכן פרטים  בצורה פשוטה ונוחה...</h6>
              </div>
            </CSSTransition>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default App;