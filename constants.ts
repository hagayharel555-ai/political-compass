import { Question, Axis } from './types';

export const QUESTIONS: Question[] = [
  // --- Economic Axis (X) ---
  { 
    id: 1, 
    text: "הממשלה צריכה להגדיל את תקציבי הרווחה והחינוך, גם אם זה דורש העלאת מיסים.", 
    effects: [{ axis: Axis.ECONOMIC, weight: -1 }] 
  },
  { 
    id: 2, 
    text: "הכלכלה הישראלית סובלת מעודף רגולציה ובירוקרטיה שחונקת את המגזר העסקי.", 
    effects: [
      { axis: Axis.ECONOMIC, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: 0.5 }
    ] 
  },
  { 
    id: 3, 
    text: "ועדי העובדים הגדולים מחזיקים בכוח מופרז שפוגע בציבור.", 
    effects: [{ axis: Axis.ECONOMIC, weight: 1 }] 
  },
  { 
    id: 4, 
    text: "המדינה צריכה לסבסד דיור לזוגות צעירים ולפקח על מחירי השכירות.", 
    effects: [{ axis: Axis.ECONOMIC, weight: -1 }] 
  },
  { 
    id: 5, 
    text: "יש לאפשר תחרות חופשית מלאה בייבוא מוצרי מזון וחקלאות, גם אם זה יפגע בחקלאים ישראלים.", 
    effects: [{ axis: Axis.ECONOMIC, weight: 1 }] 
  },
  { 
    id: 6, 
    text: "מערכת הבריאות הציבורית צריכה להיות ממומנת לחלוטין מכספי המדינה ללא ביטוחים משלימים.", 
    effects: [{ axis: Axis.ECONOMIC, weight: -1 }] 
  },
  { 
    id: 13, 
    text: "הפרטת חברות ממשלתיות היא הדרך הטובה ביותר לייעל אותן.", 
    effects: [{ axis: Axis.ECONOMIC, weight: 1 }] 
  },
  { 
    id: 14, 
    text: "יש להעלות את מס ההכנסה על בעלי משכורות גבוהות מאוד (מס עשירים).", 
    effects: [{ axis: Axis.ECONOMIC, weight: -1 }] 
  },
  { 
    id: 15, 
    text: "קצבאות הביטוח הלאומי מעודדות אנשים לא לעבוד וצריך לצמצם אותן.", 
    effects: [{ axis: Axis.ECONOMIC, weight: 1 }] 
  },
  { 
    id: 16, 
    text: "המדינה צריכה להשקיע יותר בפריפריה ובשכונות מצוקה מאשר במרכז הארץ.", 
    effects: [{ axis: Axis.ECONOMIC, weight: -1 }] 
  },
  { 
    id: 17, 
    text: "זכות השביתה היא זכות יסוד דמוקרטית שאין להגביל אותה גם בשירותים חיוניים.", 
    effects: [
      { axis: Axis.CIVIL_LIBERTY, weight: 1 }
    ] 
  },
  { 
    id: 18, 
    text: "ההייטק הישראלי הוא הקטר של המשק והמדינה צריכה לתת לו הטבות מס כדי שלא יעזוב.", 
    effects: [
      { axis: Axis.ECONOMIC, weight: 0.5 },
      { axis: Axis.CIVIL_LIBERTY, weight: -0.3 }
    ]
  },
  { 
    id: 19, 
    text: "משאבי הגז הטבעי של ישראל צריכים להיות בבעלות המדינה ובניהולה המלא.", 
    effects: [{ axis: Axis.ECONOMIC, weight: -1 }] 
  },
  { 
    id: 20, 
    text: "תשלומי הורים בבתי הספר מרחיבים את הפערים ויש לבטלם.", 
    effects: [{ axis: Axis.ECONOMIC, weight: -1 }] 
  },
  { 
    id: 21, 
    text: "שוק עבודה גמיש שבו קל לפטר עובדים תורם לצמיחה כלכלית.", 
    effects: [{ axis: Axis.ECONOMIC, weight: 1 }] 
  },
  { 
    id: 22, 
    text: "יש להגביל את שכר הבכירים בחברות הציבוריות והפיננסיות.", 
    effects: [
      { axis: Axis.ECONOMIC, weight: -1 },
      { axis: Axis.CIVIL_LIBERTY, weight: -1 }
    ] 
  },
  { 
    id: 23, 
    text: "הגירעון בתקציב המדינה הוא סכנה ויש לקצץ בהוצאות הממשלה כדי לצמצמו.", 
    effects: [{ axis: Axis.ECONOMIC, weight: 1.5 }] 
  },
  { 
    id: 24, 
    text: "המיסים על דלק ורכב בישראל גבוהים מדי וצריך להוריד אותם משמעותית.", 
    effects: [{ axis: Axis.ECONOMIC, weight: 1 }] 
  },
  { 
    id: 41, 
    text: "יש לעבור לשיטת 'השוברים' (Vouchers) בחינוך: ההורים יבחרו באיזה בית ספר להשתמש בתקציב.", 
    effects: [
      { axis: Axis.ECONOMIC, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: 1.5 }
    ] 
  },
  { 
    id: 42, 
    text: "שכר מינימום פוגע בעובדים חלשים בכך שהוא מונע מהם להיכנס לשוק העבודה.", 
    effects: [{ axis: Axis.ECONOMIC, weight: 1 }] 
  },
  { 
    id: 43, 
    text: "יש להנהיג בישראל 'מס אחיד' (Flat Tax) שבו כולם משלמים אותו אחוז מהכנסתם.", 
    effects: [{ axis: Axis.ECONOMIC, weight: 1 }] 
  },
  { 
    id: 44, 
    text: "זכות הקניין היא מקודשת: למדינה אסור להפקיע קרקע פרטית ללא הסכמת הבעלים.", 
    effects: [
      { axis: Axis.ECONOMIC, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: 1.5 }
    ] 
  },

  // --- National Security Axis (Y) ---
  { 
    id: 11, 
    text: "יש להחיל ריבונות ישראלית (סיפוח) על שטחי יהודה ושומרון.", 
    effects: [{ axis: Axis.NATIONAL_SECURITY, weight: 1 }] 
  },
  { 
    id: 12, 
    text: "יש לקדם פתרון מדיני של שתי מדינות לשני עמים כדי להבטיח את עתידה של ישראל.", 
    effects: [{ axis: Axis.NATIONAL_SECURITY, weight: -1 }] 
  },
  { 
    id: 27, 
    text: "ההתיישבות ביהודה ושומרון (התנחלויות) היא מפעל ציוני חשוב התורם לביטחון.", 
    effects: [{ axis: Axis.NATIONAL_SECURITY, weight: 1 }] 
  },
  { 
    id: 28, 
    text: "ארגוני זכויות אדם (כמו 'בצלם' או 'שוברים שתיקה') גורמים נזק למדינה ויש להגבילם.", 
    effects: [
      { axis: Axis.NATIONAL_SECURITY, weight: 0.5 },
      { axis: Axis.CIVIL_LIBERTY, weight: -0.3 }
    ] 
  },
  { 
    id: 31, 
    text: "יש לחייב את כל אזרחי ישראל, כולל חרדים וערבים, בשירות צבאי או לאומי.", 
    effects: [
      { axis: Axis.NATIONAL_SECURITY, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: -1.5 }
    ] 
  },
  { 
    id: 32, 
    text: "המשטרה צריכה לקבל יותר סמכויות (כמו חיפוש ללא צו) כדי להילחם בפשיעה.", 
    effects: [
      { axis: Axis.NATIONAL_SECURITY, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: -1.5 }
    ] 
  },
  { 
    id: 38, 
    text: "מדיניות היד הקשה היא הדרך היחידה להתמודד עם הטרור.", 
    effects: [{ axis: Axis.NATIONAL_SECURITY, weight: 1 }] 
  },
  { 
    id: 45, 
    text: "יש להקל משמעותית על אזרחים שומרי חוק לקבל רישיון לנשיאת נשק אישי.", 
    effects: [
      { axis: Axis.NATIONAL_SECURITY, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: 1.5 }
    ] 
  },
  { 
    id: 46, 
    text: "חוק הלאום הוא חוק חיוני שמגן על זהותה של ישראל כמדינת הלאום היהודי.", 
    effects: [{ axis: Axis.NATIONAL_SECURITY, weight: 1 }] 
  },
  { 
    id: 47, 
    text: "בכל נושא ביטחוני, ישראל צריכה לפעול לפי האינטרס שלה בלבד, גם בניגוד לעמדת העולם.", 
    effects: [{ axis: Axis.NATIONAL_SECURITY, weight: 1 }] 
  },
  { 
    id: 48, 
    text: "יש לאסור על עמותות המקבלות מימון זר להתערב בתהליכים פוליטיים בישראל.", 
    effects: [
      { axis: Axis.NATIONAL_SECURITY, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: -0.5 },
      { axis: Axis.ECONOMIC, weight: 1 }
    ] 
  },
  { 
    id: 49, 
    text: "החזקת שטחי יהודה ושומרון היא זכות מוסרית והיסטורית בלתי ניתנת לערעור.", 
    effects: [{ axis: Axis.NATIONAL_SECURITY, weight: 1 }] 
  },
  { 
    id: 50, 
    text: "על המדינה להפסיק מימון למוסדות תרבות המציגים נרטיב שסותר את המדינה היהודית.", 
    effects: [
      { axis: Axis.NATIONAL_SECURITY, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: -0.5 }
    ] 
  },
  { 
    id: 51, 
    text: "יש לאפשר הקמת יישובים יהודיים חדשים בכל מקום בארץ ישראל ללא מגבלות.", 
    effects: [{ axis: Axis.NATIONAL_SECURITY, weight: 1 }] 
  },
  { 
    id: 52, 
    text: "התנגדות לביצוע פקודה צבאית מטעמי מצפון או פוליטיקה היא סכנה ויש להעניש עליה בחומרה.", 
    effects: [
      { axis: Axis.NATIONAL_SECURITY, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: -1 }
    ] 
  },

  // --- Conservatism / Religion & State Axis (Z) ---
  
  // שאלה ערכית מובהקת: משפיעה חזק (1.5) על שמרנות. 
  // השמרן הליברל יסכים ויקבל הרבה נקודות כאן.
  { 
    id: 60, 
    text: "יש לתקן את חוק השבות כך שיתייחס רק ליהודים על פי ההלכה (ביטול סעיף הנכד).", 
    effects: [
      { axis: Axis.CONSERVATISM, weight: 1.5 },
      { axis: Axis.CIVIL_LIBERTY, weight: -1 }
    ] 
  },

  // שאלה על חירות/כפייה: 
  // משקל נמוך לשמרנות (0.5), משקל גבוה לחירות (1).
  // השמרן הליברל יתמוך (ייתן מינוס קטן לשמרנות), אבל לא יאבד הרבה גובה במדד.
  { 
    id: 61, 
    text: "יש לאפשר לרשויות מקומיות להפעיל תחבורה ציבורית בשבת על פי צרכי התושבים.", 
    effects: [
      { axis: Axis.CIVIL_LIBERTY, weight: 2 }
    ] 
  },

  // כנ"ל - חירות אזרחית גבוהה, השפעה שמרנית נמוכה
  { 
    id: 62, 
    text: "יש לאפשר נישואים אזרחיים בישראל לכל אזרח שירצה בכך.", 
    effects: [
      { axis: Axis.CIVIL_LIBERTY, weight: 1 }
    ] 
  },

  // שאלה ערכית: האם לימוד תורה הוא ערך עליון?
  // משפיע חזק על שמרנות.
  { 
    id: 63, 
    text: "ערך לימוד התורה חשוב לא פחות משירות צבאי, ולכן יש לאפשר לחרדים פטור מגיוס.", 
    effects: [
      { axis: Axis.CONSERVATISM, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: -0.5 } 
    ] 
  },

  { 
    id: 64, 
    text: "המדינה צריכה להכיר בזוגיות גאה באופן מלא, כולל הזכות לאמץ ילדים והליכי פונדקאות.", 
    effects: [
      { axis: Axis.CONSERVATISM, weight: 0 },
      { axis: Axis.CIVIL_LIBERTY, weight: 1.5 }
    ] 
  },

  // "לאפשר" = חירות. שמרן ליברל יסכים (ויקבל נקודות שמרנות בלי להיפגע בחירות)
  { 
    id: 65, 
    text: "יש לאפשר אירועי תרבות ולימודים בהפרדה מגדרית עבור הציבור הדתי והחרדי.", 
    effects: [
      { axis: Axis.CONSERVATISM, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: 2 }
    ] 
  },

  { 
    id: 66, 
    text: "לבית המשפט העליון יש סמכות מוגזמת ויש להגביל את יכולתו לפסול חוקים.", 
    effects: [
      { axis: Axis.CONSERVATISM, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: 0 }
    ] 
  },

  // חופש דת: שמרן ליברל יסכים
  { 
    id: 67, 
    text: "יציאת חיילים דתיים מטקסים צבאיים בהם יש שירת נשים היא צעד לגיטימי.", 
    effects: [
      { axis: Axis.CONSERVATISM, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: 2 }
    ] 
  },

  // שאלת כפייה קלאסית: 
  // הורדתי את משקל השמרנות ל-0.5. 
  // אם השמרן מתנגד לאיסור, הוא מאבד רק חצי נקודה בשמרנות, אבל מרוויח נקודה שלמה בחירות.
  { 
    id: 68, 
    text: "יש לאסור פתיחת מרכולים ומתחמי מסחר בשבת כדי לשמור על צביון המדינה.", 
    effects: [
      { axis: Axis.CONSERVATISM, weight: 0.5 },
      { axis: Axis.CIVIL_LIBERTY, weight: -1 }
    ] 
  },

  { 
    id: 69, 
    text: "יש לתת לרפורמים ולקונסרבטיבים מעמד רשמי שווה במוסדות הדת (כמו בכותל).", 
    effects: [
      { axis: Axis.CONSERVATISM, weight: -0.5 },
      { axis: Axis.CIVIL_LIBERTY, weight: 1 }
    ] 
  },

  // שאלה ערכית נטו: משפיעה חזק על שמרנות (1.5)
  { 
    id: 70, 
    text: "יש להגדיל את מכסת לימודי היהדות והמורשת בחינוך הממלכתי-חילוני.", 
    effects: [
      { axis: Axis.CONSERVATISM, weight: 1.5 },
      { axis: Axis.CIVIL_LIBERTY, weight: -0.3 }
    ] 
  },

  { 
    id: 71, 
    text: "שילוב נשים ביחידות לוחמות פוגע בכשירות המבצעית של צה\"ל.", 
    effects: [
      { axis: Axis.CONSERVATISM, weight: 1 },
      { axis: Axis.CIVIL_LIBERTY, weight: 0 }
    ] 
  }
];