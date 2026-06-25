import Interview from '../models/Interview.model.js';
import { ApiError } from '../middleware/errorHandler.js';
import { deleteAudioByUrl } from '../services/upload.service.js';

export const deleteInterviewHistoryEntry = async (req, res, deps = { Interview, deleteAudioByUrl }) => {
  const { id } = req.params;
  const interview = await deps.Interview.findOne({ _id: id, odId: req.user.uid }).lean();
  if (!interview) {
    throw new ApiError(404, 'Interview not found');
  }

  const audioUrls = (interview.answers || [])
    .map((answer) => answer.audioUrl)
    .filter(Boolean);

  for (const audioUrl of audioUrls) {
    try {
      await deps.deleteAudioByUrl(audioUrl);
    } catch (error) {
      console.warn('Failed to delete interview audio from Cloudinary:', error.message);
    }
  }

  await deps.Interview.deleteOne({ _id: id, odId: req.user.uid });

  res.json({
    success: true,
    data: {
      deletedInterviewId: id,
      deletedAudioCount: audioUrls.length
    }
  });
};
