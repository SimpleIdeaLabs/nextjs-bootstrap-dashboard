export interface FileType {
  id: number;
  name: string;
  ext: string;
  mime: string;
}

export const FileTypes: FileType[] = [
  { id: 1, name: 'Plain Text', ext: '.txt', mime: 'text/plain' },
  { id: 2, name: 'JSON', ext: '.json', mime: 'application/json' },
  { id: 3, name: 'XML', ext: '.xml', mime: 'application/xml' },
  { id: 4, name: 'PDF', ext: '.pdf', mime: 'application/pdf' },
  { id: 5, name: 'JPEG', ext: '.jpeg', mime: 'image/jpeg' },
  { id: 6, name: 'JPG', ext: '.jpg', mime: 'image/jpeg' },
  { id: 7, name: 'PNG', ext: '.png', mime: 'image/png' },
  { id: 8, name: 'GIF', ext: '.gif', mime: 'image/gif' },
  { id: 9, name: 'SVG', ext: '.svg', mime: 'image/svg+xml' },
  { id: 10, name: 'MP3', ext: '.mp3', mime: 'audio/mpeg' },
  { id: 11, name: 'WAV', ext: '.wav', mime: 'audio/wav' },
  { id: 12, name: 'MP4', ext: '.mp4', mime: 'video/mp4' },
  { id: 13, name: 'MOV', ext: '.mov', mime: 'video/quicktime' },
  { id: 14, name: 'Word', ext: '.doc', mime: 'application/msword' },
  { id: 15, name: 'Excel', ext: '.xls', mime: 'application/vnd.ms-excel' },
  { id: 16, name: 'ZIP', ext: '.zip', mime: 'application/zip' },
  {
    id: 17,
    name: 'Word (DOCX)',
    ext: '.docx',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  { id: 18, name: 'CSV', ext: '.csv', mime: 'text/csv' },
];
