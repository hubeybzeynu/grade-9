export interface Student {
  id: number;
  name: string;
  english_name: string;
  age: number;
  gender: string;
  section: string;
  telegram?: string;
  instagram?: string;
  image_url?: string;
  download_url?: string;
}

export interface ReportCard {
  student_id: number;
  student_name: string;
  grade: string;
  subjects: any;
  conduct: any;
  rank: any;
  card_password: string;
  total_students: number;
  promoted_to: string;
  detained_in_grade: string;
  days_present: number;
  days_absent: number;
}

export interface ExamResult {
  student_id: number;
  student_name: string;
  result_image_url: string;
  answer_image_url: string;
}

export type Section = '9A' | '9B' | '9C' | 'All';
export type Gender = 'Male' | 'Female' | 'All';
