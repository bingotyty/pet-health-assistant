import { supabase } from '../../lib/supabase';
import { analyzePoopWithQwen, generateHealthReport, determineRiskLevel } from '../../lib/ai-service';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);
    
    const imageFile = files.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const qwenResult = await analyzePoopWithQwen(imageFile);
    const riskLevel = determineRiskLevel(qwenResult);
    const gptReport = await generateHealthReport(qwenResult, fields.description?.[0] || '', {});

    const fileExt = imageFile.originalFilename?.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `poop-images/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pet-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image');
    }

    const { data, error } = await supabase
      .from('feces_records')
      .insert({
        image_url: uploadData.path,
        qwen_analysis: qwenResult,
        gpt_report: gptReport,
        risk_level: riskLevel,
        user_description: fields.description?.[0] || null
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save record');
    }

    res.status(200).json({
      success: true,
      data: {
        id: data.id,
        qwen_analysis: data.qwen_analysis,
        gpt_report: data.gpt_report,
        risk_level: data.risk_level,
        created_at: data.created_at
      }
    });

  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
}