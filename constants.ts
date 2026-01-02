import { Question, Axis } from './types';

// X-Axis: Economic Left (-10) to Economic Right (+10)
// Y-Axis: Libertarian/Liberal (-10) to Authoritarian/Conservative/Nationalist (+10)

export const QUESTIONS: Question[] = [
  // --- Economic Questions (Left vs Right in Israel) ---
  
  {
    id: 1,
    text: "הממשלה צריכה להגדיל את תקציבי הרווחה והחינוך, גם אם זה דורש העלאת מיסים.",
    axis: Axis.ECONOMIC,
    direction: -1, // Left
  },
  {
    id: 2,
    text: "הכלכלה הישראלית סובלת מעודף רגולציה ובירוקרטיה שחונקת את המגזר העסקי.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right
  },
  {
    id: 3,
    text: "ועדי העובדים הגדולים (כמו בנמלים או בחברת החשמל) מחזיקים בכוח מופרז שפוגע בציבור.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right
  },
  {
    id: 4,
    text: "המדינה צריכה לסבסד דיור לזוגות צעירים ולפקח על מחירי השכירות.",
    axis: Axis.ECONOMIC,
    direction: -1, // Left
  },
  {
    id: 5,
    text: "יש לאפשר תחרות חופשית מלאה בייבוא מוצרי מזון וחקלאות, גם אם זה יפגע בחקלאים ישראלים.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right
  },
  {
    id: 6,
    text: "מערכת הבריאות הציבורית בישראל צריכה להיות ממומנת לחלוטין מכספי המדינה ללא ביטוחים משלימים ושר\"פ.",
    axis: Axis.ECONOMIC,
    direction: -1, // Left
  },
  {
    id: 13,
    text: "הפרטת חברות ממשלתיות (כמו הדואר או התעשייה האווירית) היא הדרך הטובה ביותר לייעל אותן.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right
  },
  {
    id: 14,
    text: "יש להעלות את מס ההכנסה על בעלי משכורות גבוהות מאוד (מס עשירים).",
    axis: Axis.ECONOMIC,
    direction: -1, // Left
  },
  {
    id: 15,
    text: "קצבאות הביטוח הלאומי מעודדות אנשים לא לעבוד וצריך לצמצם אותן.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right
  },
  {
    id: 16,
    text: "המדינה צריכה להשקיע יותר בפריפריה ובשכונות מצוקה מאשר במרכז הארץ.",
    axis: Axis.ECONOMIC,
    direction: -1, // Left
  },
  {
    id: 17,
    text: "זכות השביתה היא זכות יסוד דמוקרטית שאין להגביל אותה גם בשירותים חיוניים.",
    axis: Axis.ECONOMIC,
    direction: -1, // Left
  },
  {
    id: 18,
    text: "ההייטק הישראלי הוא הקטר של המשק והמדינה צריכה לתת לו הטבות מס כדי שלא יעזוב.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right
  },
  {
    id: 19,
    text: "משאבי הגז הטבעי של ישראל צריכים להיות בבעלות המדינה ובניהולה המלא, ולא בידי חברות פרטיות.",
    axis: Axis.ECONOMIC,
    direction: -1, // Left
  },
  {
    id: 20,
    text: "תשלומי הורים בבתי הספר מרחיבים את הפערים ויש לבטלם לטובת חינוך חינם אמיתי.",
    axis: Axis.ECONOMIC,
    direction: -1, // Left
  },
  {
    id: 21,
    text: "שוק עבודה גמיש שבו קל לפטר עובדים תורם לצמיחה כלכלית.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right
  },
  {
    id: 22,
    text: "יש להגביל את שכר הבכירים בחברות הציבוריות והפיננסיות.",
    axis: Axis.ECONOMIC,
    direction: -1, // Left
  },
  {
    id: 23,
    text: "הגירעון בתקציב המדינה הוא סכנה ויש לקצץ בהוצאות הממשלה כדי לצמצמו.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right
  },
  {
    id: 24,
    text: "המיסים על דלק ורכב בישראל גבוהים מדי וצריך להוריד אותם משמעותית.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right
  },

  // --- New Right-Libertarian Economic Questions ---
  {
    id: 41,
    text: "יש לעבור לשיטת 'השוברים' (Vouchers) בחינוך: המדינה תיתן תקציב לכל תלמיד, וההורים יבחרו באיזה בית ספר פרטי או ציבורי להשתמש בו.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right/Libertarian
  },
  {
    id: 42,
    text: "שכר מינימום פוגע בעובדים חלשים בכך שהוא מונע מהם להיכנס לשוק העבודה, ויש לבטלו או להפחיתו.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right/Libertarian
  },
  {
    id: 43,
    text: "יש להנהיג בישראל 'מס אחיד' (Flat Tax) שבו כולם משלמים אותו אחוז מהכנסתם, ללא קשר לגובה השכר.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right/Libertarian
  },
  {
    id: 44,
    text: "זכות הקניין היא מקודשת: למדינה אסור להפקיע קרקע פרטית לצורכי ציבור (כמו כבישים או רכבת) ללא פיצוי מעל מחיר השוק והסכמת הבעלים.",
    axis: Axis.ECONOMIC,
    direction: 1, // Right/Libertarian
  },

  // --- Social/Political/Security Questions (Libertarian/Left vs Authoritarian/Right in Israel) ---
  
  {
    id: 7,
    text: "יש לאפשר תחבורה ציבורית בשבת במימון או באישור המדינה.",
    axis: Axis.SOCIAL,
    direction: -1, // Liberal/Secular
  },
  {
    id: 8,
    text: "בית המשפט העליון (בג\"ץ) מתערב יותר מדי בהחלטות הכנסת ויש להגביל את כוחו.",
    axis: Axis.SOCIAL,
    direction: 1, // Authoritarian/Conservative
  },
  {
    id: 9,
    text: "מדינת ישראל צריכה לקדם נישואים אזרחיים עבור מי שאינו מעוניין או יכול להתחתן ברבנות.",
    axis: Axis.SOCIAL,
    direction: -1, // Liberal
  },
  {
    id: 10,
    text: "במקרה של התנגשות, האופי היהודי של המדינה חשוב יותר מהערכים הדמוקרטיים-ליברליים.",
    axis: Axis.SOCIAL,
    direction: 1, // Conservative/Nationalist
  },
  {
    id: 11,
    text: "יש להחיל ריבונות ישראלית (סיפוח) על שטחי יהודה ושומרון.",
    axis: Axis.SOCIAL,
    direction: 1, // Hawk/Right
  },
  {
    id: 12,
    text: "יש לקדם פתרון מדיני של שתי מדינות לשני עמים כדי להבטיח את עתידה של ישראל.",
    axis: Axis.SOCIAL,
    direction: -1, // Dove/Left
  },
  {
    id: 27,
    text: "ההתיישבות ביהודה ושומרון (התנחלויות) היא מפעל ציוני חשוב התורם לביטחון.",
    axis: Axis.SOCIAL,
    direction: 1, // Hawk/Right
  },
  {
    id: 28,
    text: "ארגוני זכויות אדם (כמו 'בצלם' או 'שוברים שתיקה') גורמים נזק למדינה ויש להגביל את פעילותם.",
    axis: Axis.SOCIAL,
    direction: 1, // Authoritarian
  },
  {
    id: 29,
    text: "זוגות להט\"ב צריכים ליהנות משוויון זכויות מלא, כולל אימוץ ופונדקאות.",
    axis: Axis.SOCIAL,
    direction: -1, // Liberal
  },
  {
    id: 30,
    text: "חוק השבות צריך לחול רק על יהודים על פי ההלכה, ולא על נכדים של יהודים.",
    axis: Axis.SOCIAL,
    direction: 1, // Religious/Conservative
  },
  {
    id: 31,
    text: "יש לחייב את כל אזרחי ישראל, כולל חרדים וערבים, בשירות צבאי או לאומי.",
    axis: Axis.SOCIAL,
    direction: 1, // Statist/Nationalist
  },
  {
    id: 32,
    text: "המשטרה צריכה לקבל יותר סמכויות (כמו חיפוש ללא צו) כדי להילחם בפשיעה הגואה.",
    axis: Axis.SOCIAL,
    direction: 1, // Authoritarian
  },
  {
    id: 33,
    text: "שימוש בקנאביס (מריחואנה) לצרכי פנאי צריך להיות חוקי בישראל.",
    axis: Axis.SOCIAL,
    direction: -1, // Libertarian
  },
  {
    id: 34,
    text: "ערביי ישראל הם אזרחים שווי זכויות ויש לשלב אותם בכל מוקדי קבלת ההחלטות.",
    axis: Axis.SOCIAL,
    direction: -1, // Liberal/Inclusive
  },
  {
    id: 35,
    text: "מערכת המשפט צריכה לשקף יותר את ערכי המסורת היהודית.",
    axis: Axis.SOCIAL,
    direction: 1, // Conservative
  },
  {
    id: 36,
    text: "חופש הביטוי וההפגנה הם ערכים עליונים, גם בזמן מלחמה.",
    axis: Axis.SOCIAL,
    direction: -1, // Liberal
  },
  {
    id: 37,
    text: "יש לאסור על מכירת חמץ בפומבי במהלך חג הפסח בחוק.",
    axis: Axis.SOCIAL,
    direction: 1, // Religious Coercion
  },
  {
    id: 38,
    text: "מדיניות היד הקשה היא הדרך היחידה להתמודד עם הטרור.",
    axis: Axis.SOCIAL,
    direction: 1, // Hawk
  },
  {
    id: 39,
    text: "הפרדה מגדרית באירועים לציבור החרדי היא לגיטימית במרחב הציבורי.",
    axis: Axis.SOCIAL,
    direction: 1, // Conservative
  },
  {
    id: 40,
    text: "ישראל צריכה לשאוף להיות 'מדינת כל אזרחיה' מבחינה חוקתית.",
    axis: Axis.SOCIAL,
    direction: -1, // Left/Liberal
  },

  // --- New Right-Security/Hawk Questions ---
  {
    id: 45,
    text: "יש להקל משמעותית על אזרחים שומרי חוק לקבל רישיון לנשיאת נשק אישי כדי שיוכלו להגן על עצמם ועל סביבתם.",
    axis: Axis.SOCIAL,
    direction: 1, // Security-Right/Hawk
  },
  {
    id: 46,
    text: "חוק הלאום הוא חוק חיוני שמגן על זהותה של ישראל כמדינת הלאום של העם היהודי ויש לחזק אותו.",
    axis: Axis.SOCIAL,
    direction: 1, // Nationalist
  },
  {
    id: 47,
    text: "בכל נושא צבאי או ביטחוני, ישראל צריכה לפעול לפי האינטרס שלה בלבד, גם אם הדבר נוגד את עמדת הקהילה הבינלאומית.",
    axis: Axis.SOCIAL,
    direction: 1, // Hawk/Nationalist
  },
  {
    id: 48,
    text: "יש לאסור על עמותות המקבלות מימון מישויות מדיניות זרות להתערב בתהליכים פוליטיים או משפטיים בישראל.",
    axis: Axis.SOCIAL,
    direction: 1, // Nationalist/Authoritarian
  },
  {
    id: 49,
    text: "החזקת שטחי יהודה ושומרון היא זכות מוסרית והיסטורית בלתי ניתנת לערעור של עם ישראל.",
    axis: Axis.SOCIAL,
    direction: 1, // Hawk/Right
  },
  {
    id: 50,
    text: "על המדינה להפסיק כל מימון למוסדות תרבות המציגים נרטיב שסותר את קיומה של ישראל כמדינה יהודית וציונית.",
    axis: Axis.SOCIAL,
    direction: 1, // Nationalist/Authoritarian
  },
  {
    id: 51,
    text: "יש לאפשר הקמת יישובים יהודיים חדשים בכל מקום בארץ ישראל ללא מגבלות של 'מרקם תכנוני' או לחץ בינלאומי.",
    axis: Axis.SOCIAL,
    direction: 1, // Nationalist
  },
  {
    id: 52,
    text: "התנגדות לביצוע פקודה צבאית מטעמי מצפון או פוליטיקה היא סכנה לדמוקרטיה ויש להעניש עליה בחומרה.",
    axis: Axis.SOCIAL,
    direction: 1, // Authoritarian/Statist
  },
];