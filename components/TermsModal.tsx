import React from 'react';
import { X, ScrollText } from 'lucide-react';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
             <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-yellow-600 dark:text-yellow-400">
                <ScrollText className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-black text-slate-900 dark:text-white">תקנון ותנאי שימוש</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base space-y-6">
            
            <div className="space-y-2">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">תקנון תנאי שימוש ומדיניות פרטיות – המצפן הפוליטי</h4>
                <p className="text-xs text-slate-500">עדכון אחרון: פברואר 2026</p>
                <p>ברוכים הבאים לאתר "המצפן הפוליטי" (להלן: "האתר"). השימוש באתר, בתכניו ובשירותים המוצעים בו מעיד על הסכמתך המלאה לתנאים המפורטים להלן. האתר מופעל ומנוהל על ידי "פרוייקט דעת" והיוצר חגי (להלן: "מפעילי האתר").</p>
            </div>

            <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white">1. כללי ואופי השירות</h5>
                <ul className="list-disc list-inside space-y-1 pr-2">
                    <li>1.1. האתר מציע שאלון אינטראקטיבי שנועד לשקף למשתמש את מיקומו על המפה הפוליטית, בהתבסס על תשובותיו.</li>
                    <li>1.2. גיל המשתמש: השימוש באתר אינו מוגבל בגיל. עם זאת, התכנים באתר עוסקים בסוגיות פוליטיות, חברתיות ואידיאולוגיות מורכבות. השימוש באתר על ידי קטינים מומלץ בליווי או פיקוח הורי, בהתאם לשיקול דעתם של ההורים.</li>
                    <li>1.3. השימוש באתר הוא לצרכים פרטיים ואישיים בלבד. אין לעשות שימוש מסחרי בנתונים או בתוצאות ללא אישור בכתב.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white">2. איסוף מידע ומדיניות פרטיות</h5>
                <ul className="list-disc list-inside space-y-1 pr-2">
                    <li>2.1. המידע הנאסף: בעת מילוי השאלון, המערכת אוספת ושומרת את הנתונים הבאים: תשובות לשאלון, שם (שדה חובה), וכתובת דואר אלקטרוני (במידה והוזנה).</li>
                    <li>2.2. שמירת המידע: המשתמש מסכים כי המידע הנ"ל יישמר במאגרי המידע של מפעילי האתר.</li>
                    <li>2.3. היעדר עוגיות (Cookies): האתר אינו עושה שימוש בקבצי "עוגיות" (Cookies) למטרות מעקב או פרסום צד ג'.</li>
                    <li>2.4. שימוש במידע: המידע ישמש לצורך חישוב התוצאות, פילוחים סטטיסטיים פנימיים ושיפור חווית המשתמש.</li>
                    <li>2.5. דיוור וקשר: במידה והמשתמש בחר להזין כתובת דואר אלקטרוני, הוא נותן בזאת את הסכמתו לקבלת הודעות דואר אלקטרוני ממפעילי האתר מעת לעת. המשתמש רשאי לבקש את הסרתו מרשימת התפוצה בכל עת.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white">3. קניין רוחני</h5>
                <ul className="list-disc list-inside space-y-1 pr-2">
                    <li>3.1. כל זכויות היוצרים והקניין הרוחני באתר, לרבות קוד המקור, האלגוריתם, ניסוח השאלות, העיצוב הגרפי והלוגו, הינם רכושם הבלעדי של מפעילי האתר.</li>
                    <li>3.2. אין להעתיק, לשכפל, לצלם או להפיץ תכנים מהאתר ללא קבלת אישור מפורש בכתב.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white">4. הצהרת נגישות</h5>
                <ul className="list-disc list-inside space-y-1 pr-2">
                    <li>4.1. האתר הינו יוזמה פרטית ומופעל במתכונת רזה. נכון למועד זה, האתר טרם עבר התאמות נגישות מלאות לפי תקן ת"י 5568.</li>
                    <li>4.2. מפעילי האתר עושים מאמץ לאפשר שימוש נוח וברור לכלל הגולשים באמצעות דפדפנים סטנדרטיים.</li>
                    <li>4.3. במידה ונתקלת בקושי לגלוש באתר או להבין את תכניו בשל מגבלה כלשהי, ניתן לפנות אלינו ואנו נשתדל לסייע ככל הניתן.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white">5. הגבלת אחריות</h5>
                <ul className="list-disc list-inside space-y-1 pr-2">
                    <li>5.1. השירות ניתן כמות שהוא ("As Is"). התוצאות המתקבלות במצפן הפוליטי הן בגדר הערכה כללית המבוססת על אלגוריתם ממוחשב, ואין לראות בהן קביעה מוחלטת או ייעוץ מקצועי/פוליטי מכל סוג שהוא.</li>
                    <li>5.2. מפעילי האתר לא יהיו אחראים לכל נזק, ישיר או עקיף, שייגרם כתוצאה מהשימוש באתר או מהסתמכות על המידע המופיע בו. האחריות על אופן השימוש בתוצאות חלה על המשתמש בלבד.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white">6. דין וסמכות שיפוט</h5>
                <ul className="list-disc list-inside space-y-1 pr-2">
                    <li>6.1. על תקנון זה ועל השימוש באתר יחולו אך ורק דיני מדינת ישראל.</li>
                    <li>6.2. סמכות השיפוט הבלעדית בכל עניין הנוגע לתקנון זה או לשימוש באתר מוקנית לבית המשפט המוסמך במחוז דרום (או תל-אביב, לבחירתך).</li>
                </ul>
            </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-center">
             <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors w-full md:w-auto"
             >
                הבנתי וקראתי
             </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;