export interface ConsentTemplate {
  id: string;
  treatmentNameEn: string;
  treatmentNameMr: string;
  contentEn: string;
  contentMr: string;
  risksEn: string[];
  risksMr: string[];
}

export const CONSENT_TEMPLATES: ConsentTemplate[] = [
  {
    id: 'general',
    treatmentNameEn: 'General Dental Examination & Treatment',
    treatmentNameMr: 'सामान्य दंत तपासणी व उपचार संमती',
    contentEn: `I hereby give my informed consent to Patil Dental Clinic and its doctors to perform dental examination, diagnostics (including digital dental radiographs/X-rays), local anesthesia if indicated, and routine dental procedures (scaling, polishing, preventive fillings).

The nature, purpose, benefits, and reasonable alternatives of the proposed treatment have been explained to me in a language I understand. I have been given the opportunity to ask questions, and all my questions have been answered satisfactorily.`,
    contentMr: `मी याद्वारे पाटील डेंटल क्लिनिक आणि त्यांच्या डॉक्टरांना दंत तपासणी, निदान (डिजिटल एक्स-रे सह), आवश्यक असल्यास स्थानिक भूल (Local Anesthesia), आणि सामान्य दंतोपचार (दात स्वच्छता / स्केलिंग, पॉलिशिंग, प्रतिबंधात्मक फिलिंग) करण्याची संमती देत आहे.

प्रस्तावित उपचाराचे स्वरूप, उद्देश, फायदे आणि पर्यायी मार्ग मला समजणाऱ्या भाषेत समजावून सांगितले गेले आहेत. मला प्रश्न विचारण्याची संधी दिली गेली असून माझ्या सर्व शंकांचे समाधानकारक निरसन झाले आहे.`,
    risksEn: [
      'Temporary mild sensitivity or gum soreness after deep scaling',
      'Mild localized swelling or bruising at local anesthesia injection site',
      'Allergic reaction to medication or materials (medical history disclosed)'
    ],
    risksMr: [
      'दात स्वच्छतेनंतर हिरड्यांमध्ये काही दिवस हलकी संवेदनशीलता (Sensitivity)',
      'स्थानिक भूल दिलेल्या जागी तात्पुरते सुन्न वाटणे किंवा सौम्य वेदना',
      'औषधे किंवा दंत साहित्याची ऍलर्जी (माझे वैद्यकीय रेकॉर्ड स्पष्ट केले आहे)'
    ]
  },
  {
    id: 'rct',
    treatmentNameEn: 'Root Canal Treatment (RCT / Re-RCT)',
    treatmentNameMr: 'रूट कॅनल उपचार (RCT / Re-RCT) संमती',
    contentEn: `I authorize Dr. Patil and the dental team to perform Root Canal Treatment / Re-RCT on the designated tooth/teeth.

I understand that root canal treatment is an attempt to save a tooth that would otherwise require extraction due to irreversible pulp disease, deep decay, infection, or trauma. Treatment involves removing the infected neurovascular pulp, cleaning, shaping the root canals, and sealing them with biocompatible filling materials (Gutta-Percha).

I acknowledge that after RCT, the tooth becomes brittle and requires a protective Crown (Cap) to prevent fracture and ensure long-term survival.`,
    contentMr: `मी डॉ. पाटील आणि त्यांच्या दंत पथकाला संबंधित दातावर रूट कॅनल उपचार (RCT किंवा Re-RCT) करण्याची संमती देत आहे.

मला पूर्ण कल्पना आहे की रूट कॅनल उपचार हा संसर्गग्रस्त किंवा किडलेला दात न काढता वाचवण्याचा प्रयत्न आहे. यामध्ये दातातील संसर्ग झालेली नस काढून, मुळांची नळी स्वच्छ करून, औषध भरून ती सील केली जाते.

मी मान्य करतो/करते की रूट कॅनल उपचारानंतर दात ठिसूळ होतो, त्यामुळे दात तुटू नये म्हणून त्यावर क्राउन (कॅप) बसवणे अत्यंत आवश्यक आहे.`,
    risksEn: [
      'Post-operative soreness or chewing tenderness for a few days',
      'Calcified or severely curved canals that may require surgical intervention',
      'Separation of delicate endodontic instrument in complex canals',
      'Possibility of tooth fracture if protective crown is delayed'
    ],
    risksMr: [
      'उपचारानंतर २ ते ३ दिवस चावताना हलकी कळ किंवा वेदना होणे',
      'मुळांच्या नळ्या खूप वाकड्या असल्यास उपचारास जास्त वेळ लागणे',
      'कठीण नळ्यांमध्ये बारीक उपकरणाचा तुकडा अडकण्याची दुर्मिळ शक्यता',
      'कॅप (Crown) वेळेत न बसवल्यास दात तुटण्याचा धोका'
    ]
  },
  {
    id: 'extraction',
    treatmentNameEn: 'Tooth Extraction & Minor Oral Surgery',
    treatmentNameMr: 'दात काढणे व तोंडातील छोटी शस्त्रक्रिया संमती',
    contentEn: `I give my consent for the extraction of the specified non-restorable tooth / impacted third molar (wisdom tooth) / surgical root piece removal under local anesthesia.

I confirm that I have disclosed my complete medical history, including high blood pressure, diabetes, bleeding/clotting issues, heart medications (blood thinners like Aspirin, Clopidogrel), and all allergies. I promise to strictly adhere to the post-extraction care instructions (biting on gauze for 45 mins, no spitting/gargling for 24 hours, cold diet).`,
    contentMr: `मी स्थानिक भूल देऊन खराब झालेला दात / अक्कलदाढ (Impacted Wisdom Tooth) काढण्यास आणि आवश्यक असल्यास छोटी शस्त्रक्रिया करण्यास माझी संमती देत आहे.

माझा संपूर्ण वैद्यकीय इतिहास—जसे की उच्च रक्तदाब, मधुमेह, रक्त गोठण्याचे विकार, रक्त पातळ करण्याची औषधे (इकोस्प्रिन इ.) आणि ऍलर्जी याबद्दल मी डॉक्टरांना खरी माहिती दिली आहे. मी दात काढल्यानंतरच्या सर्व सूचना (४५ मिनिटे कापूस दाबून ठेवणे, २४ तास न थुंकणे, थंड व मऊ अन्न खाणे) तंतोतंत पाळेन.`,
    risksEn: [
      'Post-operative swelling, mild bleeding, or stiffness in jaw opening (trismus)',
      'Dry socket (alveolar osteitis) if blood clot dislodges due to smoking/spitting',
      'Proximity to maxillary sinus (upper back teeth) or inferior alveolar nerve (lower wisdom teeth)'
    ],
    risksMr: [
      'दात काढल्यानंतर १-२ दिवस सूज येणे किंवा तोंड उघडण्यास थोडा त्रास होणे',
      'गुळणी केल्यास किंवा थुंकल्यास रक्त साकळणे विस्कळीत होऊन तीव्र वेदना (Dry Socket)',
      'वरच्या दातांजवळ सायनस किंवा खालच्या अक्कलदाढेजवळ मज्जातंतूचा (Nerve) संपर्क'
    ]
  },
  {
    id: 'implants',
    treatmentNameEn: 'Dental Implant Placement & Restoration',
    treatmentNameMr: 'डेंटल इम्प्लांट (कृत्रिम दात प्रत्यारोपण) संमती',
    contentEn: `I understand that a dental implant is a biocompatible titanium screw surgically placed into the jawbone to replace a missing tooth root. Following successful osseointegration (bone fusion over 3 to 6 months), an abutment and crown will be secured.

I understand that success depends on adequate bone volume, overall systemic health (controlled blood sugar), strict oral hygiene, and avoiding smoking during the healing phase.`,
    contentMr: `मला माहिती देण्यात आली आहे की डेंटल इम्प्लांट हा जबड्याच्या हाडामध्ये बसवला जाणारा टायटॅनियमचा कृत्रिम स्क्रू असतो. हाडाशी त्याचे योग्य एकत्रीकरण (Osseointegration - ३ ते ६ महिने) झाल्यानंतर त्यावर नवीन दात (Crown) बसवला जातो.

इम्प्लांटचे यश जबड्यातील हाडाची गुणवत्ता, रक्तातील साखरेचे नियंत्रण, तोंडाची उत्तम स्वच्छता आणि तंबाखू/धूम्रपान पूर्णपणे टाळण्यावर अवलंबून असते.`,
    risksEn: [
      'Failure of osseointegration requiring implant removal and bone grafting',
      'Temporary numbness in lip/chin if implant is close to nerve canal',
      'Need for additional sinus lift or bone graft augmentation if bone density is low'
    ],
    risksMr: [
      'हाड जुळून न आल्यास इम्प्लांट पुन्हा काढून हाडाचा ग्राफ्ट करावा लागणे',
      'खालच्या जबड्यात मज्जातंतूच्या संपर्कामुळे ओठास काही काळ मुंग्या येणे',
      'हाड कमी असल्यास बोन ग्राफ्ट किंवा सायनस लिफ्ट शस्त्रक्रियेची आवश्यकता'
    ]
  },
  {
    id: 'aligners',
    treatmentNameEn: 'Orthodontics & Clear Aligners',
    treatmentNameMr: 'ऑर्थोडोंटिक (तारेचे उपचार) व अलाइनर संमती',
    contentEn: `I consent to orthodontic alignment / clear aligner treatment to correct dental crowding, spacing, or malocclusion.

I understand that aligners must be worn for a minimum of 20 to 22 hours per day to achieve planned tooth movement. Failure to wear aligners consistently will prolong treatment and affect end results. I acknowledge that retention appliances (retainers) will be required permanently after treatment completion to prevent relapse.`,
    contentMr: `मी दातांची वाकडीतिकडी रचना, फटी किंवा चावण्याच्या अडचणी दुरुस्त करण्यासाठी ऑर्थोडोंटिक / क्लिअर अलाइनर उपचारांना संमती देत आहे.

मला स्पष्ट करण्यात आले आहे की अलाइनर दिवसातून किमान २० ते २२ तास घालणे बंधनकारक आहे. नियमित न वापरल्यास उपचारांचा कालावधी वाढेल. उपचार पूर्ण झाल्यानंतर दात परत पूर्वीच्या जागेवर जाऊ नयेत म्हणून रिटेनर (Retainer) वापरणे आवश्यक आहे.`,
    risksEn: [
      'Mild soreness and pressure during first 2-3 days of each new tray',
      'Interproximal reduction (IPR) of enamel (0.2 - 0.5mm) as planned',
      'Relapse of teeth alignment if retainers are not worn as prescribed post-treatment'
    ],
    risksMr: [
      'प्रत्येक नवीन अलाइनर ट्रे सुरुवातीला २-३ दिवस घट्ट वाटणे किंवा हलकी कळ येणे',
      'जागा तयार करण्यासाठी दातांच्या कडांची सूक्ष्म घासणी (IPR)',
      'उपचारानंतर रिटेनर न वापरल्यास दात पुन्हा हलण्याचा धोका (Relapse)'
    ]
  },
  {
    id: 'prostho',
    treatmentNameEn: 'Crowns, Bridges & Veneers (Smile Designing)',
    treatmentNameMr: 'क्राउन, ब्रिज, विनिअर्स व स्माइल डिझायनिंग संमती',
    contentEn: `I authorize Patil Dental Clinic to prepare my teeth for fixed prosthodontic restoration (Crown, Bridge, or Veneers) and custom laboratory fabrication.

I have participated in shade selection and mockup evaluation. I understand that irreversible enamel preparation is necessary to accommodate aesthetic and functional porcelain/zirconia materials. Once cemented permanently, alteration to shade or shape requires complete replacement.`,
    contentMr: `मी माझ्या दातांचे सौंदर्य व कार्य सुधारण्यासाठी फिक्स्ड क्राउन, ब्रिज किंवा विनिअर्स (स्माइल डिझायनिंग) बनवण्यास संमती देत आहे.

मी स्वतः दाताचा रंग (Shade) व डिझाइन निवडीमध्ये भाग घेतला आहे. नैसर्गिक दिसण्यासाठी दाताची सूक्ष्म तयारी करणे आवश्यक असते. एकदा कायमस्वरूपी सिमेंटने बसवल्यानंतर रंग किंवा आकार बदलण्यासाठी नवीन क्राउन बनवावा लागतो याची मला जाणीव आहे.`,
    risksEn: [
      'Mild thermal sensitivity in vital teeth following preparation',
      'Need for prophylactic root canal if decay extends close to nerve',
      'Porcelain chipping under excessive biting force, bruxism, or trauma'
    ],
    risksMr: [
      'तयारीनंतर दात गार किंवा गरम पाण्याला काही दिवस संवेदनशील वाटणे',
      'कीड नसेजवळ असल्यास आधी रूट कॅनल (RCT) करण्याची गरज भासणे',
      'खूप कडक वस्तू चावल्यास किंवा दात खाण्याच्या सवयीने पोर्सिलेन चिप होणे'
    ]
  }
];
