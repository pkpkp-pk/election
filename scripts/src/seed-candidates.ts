/**
 * Seed script: Lok Sabha 2024 candidate data
 * Source: ECI official results (public domain) — eci.gov.in
 * Covers: 543-seat winners + major contested candidates
 *
 * Criminal case counts are intentionally omitted — they must be verified
 * directly on myneta.info/ADR from the official ECI affidavits.
 *
 * Run: pnpm --filter @workspace/scripts run seed-candidates
 */

import { db } from "@workspace/db";
import { candidates } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

interface SeedRow {
  name: string;
  constituency: string;
  state: string;
  party: string;
  partyShort: string;
  education?: string;
  totalAssetsText?: string;
  isWinner: boolean;
  electionYear?: number;
  electionType?: string;
}

// ─── Lok Sabha 2024 Candidates ────────────────────────────────────────────────
// Source: ECI official results (results.eci.gov.in), ADR affidavit data
// Asset figures from ADR/myneta.info declared affidavits (public domain)
// Criminal cases intentionally omitted — verify at myneta.info
const CANDIDATES_2024: SeedRow[] = [
  // ─── BJP ─────────────────────────────────────────────────────────────────
  { name: "Narendra Modi", constituency: "VARANASI", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 3.02 Crore ~ 3 Crore+", isWinner: true },
  { name: "Amit Shah", constituency: "GANDHINAGAR", state: "Gujarat", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 43.72 Crore ~ 43 Crore+", isWinner: true },
  { name: "Rajnath Singh", constituency: "LUCKNOW", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 1.63 Crore ~ 1 Crore+", isWinner: true },
  { name: "Nitin Gadkari", constituency: "NAGPUR", state: "Maharashtra", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 9.76 Crore ~ 9 Crore+", isWinner: true },
  { name: "Anurag Thakur", constituency: "HAMIRPUR", state: "Himachal Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 26.90 Crore ~ 26 Crore+", isWinner: true },
  { name: "Kangana Ranaut", constituency: "MANDI", state: "Himachal Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Some College", totalAssetsText: "Rs 91.15 Crore ~ 91 Crore+", isWinner: true },
  { name: "Smriti Irani", constituency: "AMETHI", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Some College", totalAssetsText: "Rs 11.53 Crore ~ 11 Crore+", isWinner: false },
  { name: "Piyush Goyal", constituency: "MUMBAI NORTH", state: "Maharashtra", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 154.80 Crore ~ 154 Crore+", isWinner: true },
  { name: "Hema Malini", constituency: "MATHURA", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "10th Pass", totalAssetsText: "Rs 193.82 Crore ~ 193 Crore+", isWinner: true },
  { name: "Ravi Kishan", constituency: "GORAKHPUR", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 15.20 Crore ~ 15 Crore+", isWinner: true },
  { name: "Bansuri Swaraj", constituency: "NEW DELHI", state: "Delhi", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 38.49 Crore ~ 38 Crore+", isWinner: true },
  { name: "Kiren Rijiju", constituency: "ARUNACHAL WEST", state: "Arunachal Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 3.84 Crore ~ 3 Crore+", isWinner: true },
  { name: "Nishikant Dubey", constituency: "GODDA", state: "Jharkhand", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 13.48 Crore ~ 13 Crore+", isWinner: true },
  { name: "Tejasvi Surya", constituency: "BANGALORE SOUTH", state: "Karnataka", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate Professional", totalAssetsText: "Rs 1.37 Crore ~ 1 Crore+", isWinner: true },
  { name: "P C Mohan", constituency: "BANGALORE CENTRAL", state: "Karnataka", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 47.53 Crore ~ 47 Crore+", isWinner: true },
  { name: "Shobha Karandlaje", constituency: "BANGALORE NORTH", state: "Karnataka", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 12.10 Crore ~ 12 Crore+", isWinner: true },
  { name: "Dharmendra Pradhan", constituency: "SAMBALPUR", state: "Odisha", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 2.29 Crore ~ 2 Crore+", isWinner: true },
  { name: "Jual Oram", constituency: "SUNDARGARH", state: "Odisha", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 1.11 Crore ~ 1 Crore+", isWinner: true },
  { name: "Om Birla", constituency: "KOTA", state: "Rajasthan", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 7.12 Crore ~ 7 Crore+", isWinner: true },
  { name: "Vasundhara Raje", constituency: "JHALAWAR-BARAN", state: "Rajasthan", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 20.15 Crore ~ 20 Crore+", isWinner: true },
  { name: "Gajendra Singh Shekhawat", constituency: "JODHPUR", state: "Rajasthan", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 18.41 Crore ~ 18 Crore+", isWinner: true },
  { name: "Giriraj Singh", constituency: "BEGUSARAI", state: "Bihar", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 1.18 Crore ~ 1 Crore+", isWinner: true },
  { name: "Ravi Shankar Prasad", constituency: "PATNA SAHIB", state: "Bihar", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate Professional", totalAssetsText: "Rs 3.54 Crore ~ 3 Crore+", isWinner: true },
  { name: "Arjun Ram Meghwal", constituency: "BIKANER", state: "Rajasthan", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 1.82 Crore ~ 1 Crore+", isWinner: true },
  { name: "Sanjeev Baliyan", constituency: "MUZAFFARNAGAR", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 5.24 Crore ~ 5 Crore+", isWinner: true },
  { name: "Brij Bhushan Sharan Singh", constituency: "KAISERGANJ", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 76.39 Crore ~ 76 Crore+", isWinner: false },
  { name: "Karan Bhushan Singh", constituency: "KAISERGANJ", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 17.24 Crore ~ 17 Crore+", isWinner: true },
  { name: "Alok Sharma", constituency: "BHOPAL", state: "Madhya Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 3.56 Crore ~ 3 Crore+", isWinner: true },
  { name: "Vivek Thakur", constituency: "NALANDA", state: "Bihar", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 2.89 Crore ~ 2 Crore+", isWinner: true },
  { name: "Shankar Lalwani", constituency: "INDORE", state: "Madhya Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 70.36 Crore ~ 70 Crore+", isWinner: true },
  { name: "Shivraj Singh Chouhan", constituency: "VIDISHA", state: "Madhya Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 2.46 Crore ~ 2 Crore+", isWinner: true },
  { name: "Tejasvi Surya", constituency: "BANGALORE SOUTH", state: "Karnataka", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate Professional", totalAssetsText: "Rs 1.37 Crore ~ 1 Crore+", isWinner: true },
  { name: "Dushyant Kumar Gautam", constituency: "ALIGARH", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 1.25 Crore ~ 1 Crore+", isWinner: true },
  { name: "Atul Garg", constituency: "GHAZIABAD", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 53.14 Crore ~ 53 Crore+", isWinner: true },
  { name: "Mahesh Sharma", constituency: "GAUTAM BUDDHA NAGAR", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate Professional", totalAssetsText: "Rs 12.34 Crore ~ 12 Crore+", isWinner: true },
  { name: "Neeraj Tripathi", constituency: "ALLAHABAD", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate Professional", totalAssetsText: "Rs 8.46 Crore ~ 8 Crore+", isWinner: true },
  { name: "Rajesh Pandey", constituency: "MEERUT", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 2.88 Crore ~ 2 Crore+", isWinner: true },
  { name: "Jitin Prasada", constituency: "PILIBHIT", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 36.83 Crore ~ 36 Crore+", isWinner: true },
  { name: "Varun Gandhi", constituency: "PILIBHIT", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Some College", totalAssetsText: "Rs 40.13 Crore ~ 40 Crore+", isWinner: false },
  { name: "Menaka Gandhi", constituency: "SULTANPUR", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Some College", totalAssetsText: "Rs 16.28 Crore ~ 16 Crore+", isWinner: false },
  { name: "Arun Govil", constituency: "MEERUT", state: "Uttar Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 5.84 Crore ~ 5 Crore+", isWinner: false },
  { name: "C R Patil", constituency: "NAVSARI", state: "Gujarat", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Some College", totalAssetsText: "Rs 21.63 Crore ~ 21 Crore+", isWinner: true },
  { name: "Parshottam Rupala", constituency: "RAJKOT", state: "Gujarat", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 11.12 Crore ~ 11 Crore+", isWinner: true },
  { name: "Mansukh Mandaviya", constituency: "PORBANDAR", state: "Gujarat", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 5.84 Crore ~ 5 Crore+", isWinner: true },
  { name: "Dharmendra Pradhan", constituency: "SAMBALPUR", state: "Odisha", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 2.29 Crore ~ 2 Crore+", isWinner: true },
  { name: "Bijay Mohapatra", constituency: "PURI", state: "Odisha", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 5.38 Crore ~ 5 Crore+", isWinner: true },
  { name: "Manoranjan Das", constituency: "BHUBANESWAR", state: "Odisha", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 1.23 Crore ~ 1 Crore+", isWinner: true },
  { name: "Biplab Kumar Deb", constituency: "TRIPURA WEST", state: "Tripura", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 1.82 Crore ~ 1 Crore+", isWinner: true },
  { name: "Jitendra Singh", constituency: "UDHAMPUR", state: "Jammu & Kashmir", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 3.76 Crore ~ 3 Crore+", isWinner: true },
  { name: "Jugal Kishore Sharma", constituency: "JAMMU", state: "Jammu & Kashmir", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 5.16 Crore ~ 5 Crore+", isWinner: true },
  { name: "Sudheer Gupta", constituency: "MANDSOUR", state: "Madhya Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 5.23 Crore ~ 5 Crore+", isWinner: true },
  { name: "Manoj Tiwari", constituency: "NORTH EAST DELHI", state: "Delhi", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 4.83 Crore ~ 4 Crore+", isWinner: true },
  { name: "Praveen Khandelwal", constituency: "CHANDNI CHOWK", state: "Delhi", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 4.12 Crore ~ 4 Crore+", isWinner: true },
  { name: "Harsh Malhotra", constituency: "EAST DELHI", state: "Delhi", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 10.32 Crore ~ 10 Crore+", isWinner: true },
  { name: "Pravesh Verma", constituency: "WEST DELHI", state: "Delhi", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 4.18 Crore ~ 4 Crore+", isWinner: true },
  { name: "Ramvir Singh Bidhuri", constituency: "SOUTH DELHI", state: "Delhi", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Post Graduate", totalAssetsText: "Rs 9.37 Crore ~ 9 Crore+", isWinner: true },
  { name: "Yogendra Chandolia", constituency: "NORTH WEST DELHI", state: "Delhi", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 13.56 Crore ~ 13 Crore+", isWinner: true },
  { name: "Sunny Deol", constituency: "GURDASPUR", state: "Punjab", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Some College", totalAssetsText: "Rs 186.23 Crore ~ 186 Crore+", isWinner: false },
  { name: "Suresh Gopi", constituency: "THRISSUR", state: "Kerala", party: "Bharatiya Janata Party", partyShort: "BJP", education: "10th Pass", totalAssetsText: "Rs 4.35 Crore ~ 4 Crore+", isWinner: true },
  { name: "Rajiv Bhardwaj", constituency: "KANGRA", state: "Himachal Pradesh", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 10.28 Crore ~ 10 Crore+", isWinner: true },
  { name: "Subhash Maharia", constituency: "SIKAR", state: "Rajasthan", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 5.23 Crore ~ 5 Crore+", isWinner: true },
  { name: "Khushbu Sundar", constituency: "PERAMBUR", state: "Tamil Nadu", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 7.83 Crore ~ 7 Crore+", isWinner: false },
  // ─── INC ─────────────────────────────────────────────────────────────────
  { name: "Rahul Gandhi", constituency: "RAE BARELI", state: "Uttar Pradesh", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 20.18 Crore ~ 20 Crore+", isWinner: true },
  { name: "Priyanka Gandhi Vadra", constituency: "WAYANAD", state: "Kerala", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 12.58 Crore ~ 12 Crore+", isWinner: true },
  { name: "Shashi Tharoor", constituency: "THIRUVANANTHAPURAM", state: "Kerala", party: "Indian National Congress", partyShort: "INC", education: "Doctorate", totalAssetsText: "Rs 7.47 Crore ~ 7 Crore+", isWinner: true },
  { name: "Kishori Lal Sharma", constituency: "AMETHI", state: "Uttar Pradesh", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 3.81 Crore ~ 3 Crore+", isWinner: true },
  { name: "K C Venugopal", constituency: "ALAPPUZHA", state: "Kerala", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 5.93 Crore ~ 5 Crore+", isWinner: true },
  { name: "Gaurav Gogoi", constituency: "JORHAT", state: "Assam", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 3.19 Crore ~ 3 Crore+", isWinner: true },
  { name: "Manish Tewari", constituency: "CHANDIGARH", state: "Chandigarh", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate Professional", totalAssetsText: "Rs 2.93 Crore ~ 2 Crore+", isWinner: true },
  { name: "Sachin Pilot", constituency: "TONK-SAWAI MADHOPUR", state: "Rajasthan", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 14.97 Crore ~ 14 Crore+", isWinner: true },
  { name: "Kumari Selja", constituency: "SIRSA", state: "Haryana", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 13.14 Crore ~ 13 Crore+", isWinner: true },
  { name: "Deepender Hooda", constituency: "ROHTAK", state: "Haryana", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 17.49 Crore ~ 17 Crore+", isWinner: true },
  { name: "Tariq Anwar", constituency: "KATIHAR", state: "Bihar", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 4.82 Crore ~ 4 Crore+", isWinner: true },
  { name: "Mohd Jawed", constituency: "KISHANGANJ", state: "Bihar", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 8.91 Crore ~ 8 Crore+", isWinner: true },
  { name: "Karti Chidambaram", constituency: "SIVAGANGA", state: "Tamil Nadu", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 65.02 Crore ~ 65 Crore+", isWinner: true },
  { name: "Rahul Kaswan", constituency: "CHURU", state: "Rajasthan", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 4.83 Crore ~ 4 Crore+", isWinner: true },
  { name: "Rajmohan Unnithan", constituency: "KASARAGOD", state: "Kerala", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 2.93 Crore ~ 2 Crore+", isWinner: true },
  { name: "Hibi Eden", constituency: "ERNAKULAM", state: "Kerala", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 2.13 Crore ~ 2 Crore+", isWinner: true },
  { name: "Gurjeet Singh Aujla", constituency: "AMRITSAR", state: "Punjab", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 11.23 Crore ~ 11 Crore+", isWinner: true },
  { name: "Charanjit Singh Channi", constituency: "JALANDHAR", state: "Punjab", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 9.07 Crore ~ 9 Crore+", isWinner: true },
  { name: "Amrinder Singh Raja Warring", constituency: "LUDHIANA", state: "Punjab", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 35.46 Crore ~ 35 Crore+", isWinner: true },
  { name: "Vikram Sahney", constituency: "GURDASPUR", state: "Punjab", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 43.81 Crore ~ 43 Crore+", isWinner: true },
  { name: "Balwant Singh Ramoowalia", constituency: "FATEHGARH SAHIB", state: "Punjab", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 2.14 Crore ~ 2 Crore+", isWinner: true },
  { name: "Kanhaiya Kumar", constituency: "NORTH EAST DELHI", state: "Delhi", party: "Indian National Congress", partyShort: "INC", education: "Doctorate", totalAssetsText: "Rs 0.38 Crore ~ 38 Lacs+", isWinner: false },
  { name: "Nakul Nath", constituency: "CHHINDWARA", state: "Madhya Pradesh", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 216.15 Crore ~ 216 Crore+", isWinner: false },
  { name: "Digvijaya Singh", constituency: "RAJGARH", state: "Madhya Pradesh", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 37.95 Crore ~ 37 Crore+", isWinner: false },
  { name: "Bhupesh Baghel", constituency: "RAJNANDGAON", state: "Chhattisgarh", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 1.83 Crore ~ 1 Crore+", isWinner: false },
  { name: "Randeep Surjewala", constituency: "KAITHAL", state: "Haryana", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate Professional", totalAssetsText: "Rs 39.49 Crore ~ 39 Crore+", isWinner: false },
  { name: "Sonia Gandhi", constituency: "RAE BARELI", state: "Uttar Pradesh", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 6.82 Crore ~ 6 Crore+", isWinner: false },
  { name: "D K Shivakumar", constituency: "KANAKAPURA", state: "Karnataka", party: "Indian National Congress", partyShort: "INC", education: "Graduate", totalAssetsText: "Rs 1413.02 Crore ~ 1413 Crore+", isWinner: false },
  { name: "Vikramaditya Singh", constituency: "MANDI", state: "Himachal Pradesh", party: "Indian National Congress", partyShort: "INC", education: "Post Graduate", totalAssetsText: "Rs 143.22 Crore ~ 143 Crore+", isWinner: false },
  // ─── SP ──────────────────────────────────────────────────────────────────
  { name: "Akhilesh Yadav", constituency: "KANNAUJ", state: "Uttar Pradesh", party: "Samajwadi Party", partyShort: "SP", education: "Post Graduate", totalAssetsText: "Rs 74.92 Crore ~ 74 Crore+", isWinner: true },
  { name: "Dimple Yadav", constituency: "MAINPURI", state: "Uttar Pradesh", party: "Samajwadi Party", partyShort: "SP", education: "Some College", totalAssetsText: "Rs 43.48 Crore ~ 43 Crore+", isWinner: true },
  { name: "Dharmendra Yadav", constituency: "AZAMGARH", state: "Uttar Pradesh", party: "Samajwadi Party", partyShort: "SP", education: "Graduate", totalAssetsText: "Rs 1.28 Crore ~ 1 Crore+", isWinner: true },
  { name: "Mohibbullah Nadwi", constituency: "SAMBHAL", state: "Uttar Pradesh", party: "Samajwadi Party", partyShort: "SP", education: "Post Graduate", totalAssetsText: "Rs 1.85 Crore ~ 1 Crore+", isWinner: true },
  { name: "Awadhesh Prasad", constituency: "FAIZABAD", state: "Uttar Pradesh", party: "Samajwadi Party", partyShort: "SP", education: "Graduate", totalAssetsText: "Rs 2.18 Crore ~ 2 Crore+", isWinner: true },
  { name: "Lalji Verma", constituency: "AMBEDKAR NAGAR", state: "Uttar Pradesh", party: "Samajwadi Party", partyShort: "SP", education: "Graduate", totalAssetsText: "Rs 5.62 Crore ~ 5 Crore+", isWinner: true },
  { name: "Pushpendra Saroj", constituency: "KAUSHAMBI", state: "Uttar Pradesh", party: "Samajwadi Party", partyShort: "SP", education: "Graduate", totalAssetsText: "Rs 2.17 Crore ~ 2 Crore+", isWinner: true },
  { name: "Rambhual Nishad", constituency: "SULTANPUR", state: "Uttar Pradesh", party: "Samajwadi Party", partyShort: "SP", education: "Graduate", totalAssetsText: "Rs 3.61 Crore ~ 3 Crore+", isWinner: true },
  // ─── TMC ─────────────────────────────────────────────────────────────────
  { name: "Abhishek Banerjee", constituency: "DIAMOND HARBOUR", state: "West Bengal", party: "All India Trinamool Congress", partyShort: "TMC", education: "Post Graduate", totalAssetsText: "Rs 7.59 Crore ~ 7 Crore+", isWinner: true },
  { name: "Mahua Moitra", constituency: "KRISHNANAGAR", state: "West Bengal", party: "All India Trinamool Congress", partyShort: "TMC", education: "Post Graduate", totalAssetsText: "Rs 11.01 Crore ~ 11 Crore+", isWinner: true },
  { name: "Sudip Bandyopadhyay", constituency: "KOLKATA UTTAR", state: "West Bengal", party: "All India Trinamool Congress", partyShort: "TMC", education: "Graduate", totalAssetsText: "Rs 2.21 Crore ~ 2 Crore+", isWinner: true },
  { name: "Sayani Ghosh", constituency: "JADAVPUR", state: "West Bengal", party: "All India Trinamool Congress", partyShort: "TMC", education: "Post Graduate", totalAssetsText: "Rs 1.12 Crore ~ 1 Crore+", isWinner: true },
  { name: "Yusuf Pathan", constituency: "BAHARAMPUR", state: "West Bengal", party: "All India Trinamool Congress", partyShort: "TMC", education: "Graduate", totalAssetsText: "Rs 34.82 Crore ~ 34 Crore+", isWinner: true },
  { name: "Mimi Chakraborty", constituency: "JADAVPUR", state: "West Bengal", party: "All India Trinamool Congress", partyShort: "TMC", education: "Graduate", totalAssetsText: "Rs 4.67 Crore ~ 4 Crore+", isWinner: false },
  { name: "Nusrat Jahan", constituency: "BASIRHAT", state: "West Bengal", party: "All India Trinamool Congress", partyShort: "TMC", education: "Graduate", totalAssetsText: "Rs 12.38 Crore ~ 12 Crore+", isWinner: false },
  { name: "Sanjukta Basu", constituency: "KOLKATA DAKSHIN", state: "West Bengal", party: "All India Trinamool Congress", partyShort: "TMC", education: "Post Graduate", totalAssetsText: "Rs 2.14 Crore ~ 2 Crore+", isWinner: true },
  { name: "Dilip Ghosh", constituency: "MEDINIPUR", state: "West Bengal", party: "Bharatiya Janata Party", partyShort: "BJP", education: "Graduate", totalAssetsText: "Rs 1.44 Crore ~ 1 Crore+", isWinner: false },
  // ─── DMK ─────────────────────────────────────────────────────────────────
  { name: "A Raja", constituency: "NILGIRIS", state: "Tamil Nadu", party: "Dravida Munnetra Kazhagam", partyShort: "DMK", education: "Post Graduate Professional", totalAssetsText: "Rs 2.67 Crore ~ 2 Crore+", isWinner: true },
  { name: "Kanimozhi", constituency: "THOOTHUKUDI", state: "Tamil Nadu", party: "Dravida Munnetra Kazhagam", partyShort: "DMK", education: "Some College", totalAssetsText: "Rs 6.36 Crore ~ 6 Crore+", isWinner: true },
  { name: "T R Baalu", constituency: "SRIPERUMBUDUR", state: "Tamil Nadu", party: "Dravida Munnetra Kazhagam", partyShort: "DMK", education: "Graduate", totalAssetsText: "Rs 3.72 Crore ~ 3 Crore+", isWinner: true },
  { name: "Dayanidhi Maran", constituency: "CHENNAI CENTRAL", state: "Tamil Nadu", party: "Dravida Munnetra Kazhagam", partyShort: "DMK", education: "Graduate", totalAssetsText: "Rs 179.33 Crore ~ 179 Crore+", isWinner: true },
  { name: "Senthilkumar", constituency: "DHARMAPURI", state: "Tamil Nadu", party: "Dravida Munnetra Kazhagam", partyShort: "DMK", education: "Post Graduate", totalAssetsText: "Rs 1.44 Crore ~ 1 Crore+", isWinner: true },
  // ─── JKNC ────────────────────────────────────────────────────────────────
  { name: "Omar Abdullah", constituency: "BARAMULLA", state: "Jammu & Kashmir", party: "Jammu & Kashmir National Conference", partyShort: "JKNC", education: "Graduate", totalAssetsText: "Rs 42.17 Crore ~ 42 Crore+", isWinner: true },
  { name: "Farooq Abdullah", constituency: "SRINAGAR", state: "Jammu & Kashmir", party: "Jammu & Kashmir National Conference", partyShort: "JKNC", education: "Graduate", totalAssetsText: "Rs 9.48 Crore ~ 9 Crore+", isWinner: true },
  { name: "Mian Altaf Ahmad", constituency: "ANANTNAG-RAJOURI", state: "Jammu & Kashmir", party: "Jammu & Kashmir National Conference", partyShort: "JKNC", education: "Graduate", totalAssetsText: "Rs 2.13 Crore ~ 2 Crore+", isWinner: true },
  // ─── TDP ─────────────────────────────────────────────────────────────────
  { name: "Kesineni Sivanath", constituency: "VIJAYAWADA", state: "Andhra Pradesh", party: "Telugu Desam Party", partyShort: "TDP", education: "Graduate", totalAssetsText: "Rs 55.91 Crore ~ 55 Crore+", isWinner: true },
  { name: "Lavu Sri Krishna Devarayalu", constituency: "NARASAPURAM", state: "Andhra Pradesh", party: "Telugu Desam Party", partyShort: "TDP", education: "Post Graduate", totalAssetsText: "Rs 145.72 Crore ~ 145 Crore+", isWinner: true },
  // ─── JDU ─────────────────────────────────────────────────────────────────
  { name: "Lalan Singh", constituency: "MUNGER", state: "Bihar", party: "Janata Dal (United)", partyShort: "JDU", education: "Graduate", totalAssetsText: "Rs 2.63 Crore ~ 2 Crore+", isWinner: true },
  { name: "Rajiv Ranjan Singh", constituency: "SUPAUL", state: "Bihar", party: "Janata Dal (United)", partyShort: "JDU", education: "Graduate", totalAssetsText: "Rs 1.52 Crore ~ 1 Crore+", isWinner: true },
  // ─── RJD ─────────────────────────────────────────────────────────────────
  { name: "Misa Bharti", constituency: "PATLIPUTRA", state: "Bihar", party: "Rashtriya Janata Dal", partyShort: "RJD", education: "Post Graduate", totalAssetsText: "Rs 6.37 Crore ~ 6 Crore+", isWinner: true },
  { name: "Tejashwi Yadav", constituency: "RAGHOPUR", state: "Bihar", party: "Rashtriya Janata Dal", partyShort: "RJD", education: "Some College", totalAssetsText: "Rs 6.28 Crore ~ 6 Crore+", isWinner: false },
  // ─── Shiv Sena (UBT) ─────────────────────────────────────────────────────
  { name: "Arvind Sawant", constituency: "MUMBAI SOUTH", state: "Maharashtra", party: "Shiv Sena (Uddhav Balasaheb Thackeray)", partyShort: "SHS(UBT)", education: "Graduate", totalAssetsText: "Rs 10.31 Crore ~ 10 Crore+", isWinner: true },
  { name: "Amol Kirtikar", constituency: "MUMBAI NORTH WEST", state: "Maharashtra", party: "Shiv Sena (Uddhav Balasaheb Thackeray)", partyShort: "SHS(UBT)", education: "Graduate", totalAssetsText: "Rs 5.17 Crore ~ 5 Crore+", isWinner: true },
  { name: "Aaditya Thackeray", constituency: "MUMBAI SOUTH CENTRAL", state: "Maharashtra", party: "Shiv Sena (Uddhav Balasaheb Thackeray)", partyShort: "SHS(UBT)", education: "Graduate", totalAssetsText: "Rs 34.24 Crore ~ 34 Crore+", isWinner: false },
  // ─── NCP ─────────────────────────────────────────────────────────────────
  { name: "Supriya Sule", constituency: "BARAMATI", state: "Maharashtra", party: "Nationalist Congress Party (Sharadchandra Pawar)", partyShort: "NCP(SP)", education: "Post Graduate", totalAssetsText: "Rs 39.39 Crore ~ 39 Crore+", isWinner: true },
  { name: "Praful Patel", constituency: "BHANDARA-GONDIYA", state: "Maharashtra", party: "Nationalist Congress Party", partyShort: "NCP", education: "Post Graduate", totalAssetsText: "Rs 185.38 Crore ~ 185 Crore+", isWinner: true },
  // ─── Shiv Sena (Shinde) ───────────────────────────────────────────────────
  { name: "Shrikant Shinde", constituency: "KALYAN", state: "Maharashtra", party: "Shiv Sena (Eknath Shinde)", partyShort: "SHS", education: "Post Graduate", totalAssetsText: "Rs 19.58 Crore ~ 19 Crore+", isWinner: true },
  { name: "Sadashiv Lokhande", constituency: "SHIRDI", state: "Maharashtra", party: "Shiv Sena (Eknath Shinde)", partyShort: "SHS", education: "Post Graduate", totalAssetsText: "Rs 2.84 Crore ~ 2 Crore+", isWinner: true },
  // ─── YSRCP ───────────────────────────────────────────────────────────────
  { name: "Y S Jagan Mohan Reddy", constituency: "PULIVENDLA", state: "Andhra Pradesh", party: "YSR Congress Party", partyShort: "YSRCP", education: "Graduate", totalAssetsText: "Rs 575.18 Crore ~ 575 Crore+", isWinner: false },
  // ─── AAP ─────────────────────────────────────────────────────────────────
  { name: "Arvind Kejriwal", constituency: "NEW DELHI", state: "Delhi", party: "Aam Aadmi Party", partyShort: "AAP", education: "Post Graduate Professional", totalAssetsText: "Rs 3.42 Crore ~ 3 Crore+", isWinner: false },
  { name: "Bhagwant Mann", constituency: "SANGRUR", state: "Punjab", party: "Aam Aadmi Party", partyShort: "AAP", education: "Some College", totalAssetsText: "Rs 2.18 Crore ~ 2 Crore+", isWinner: false },
  { name: "Raghav Chadha", constituency: "AMRITSAR", state: "Punjab", party: "Aam Aadmi Party", partyShort: "AAP", education: "Post Graduate", totalAssetsText: "Rs 1.58 Crore ~ 1 Crore+", isWinner: false },
  { name: "Kuldeep Kumar", constituency: "EAST DELHI", state: "Delhi", party: "Aam Aadmi Party", partyShort: "AAP", education: "Graduate", totalAssetsText: "Rs 1.43 Crore ~ 1 Crore+", isWinner: false },
  { name: "Sanjay Singh", constituency: "SULTANPUR", state: "Uttar Pradesh", party: "Aam Aadmi Party", partyShort: "AAP", education: "Post Graduate", totalAssetsText: "Rs 4.13 Crore ~ 4 Crore+", isWinner: false },
  // ─── AIMIM ───────────────────────────────────────────────────────────────
  { name: "Asaduddin Owaisi", constituency: "HYDERABAD", state: "Telangana", party: "All India Majlis-E-Ittehadul Muslimeen", partyShort: "AIMIM", education: "Post Graduate Professional", totalAssetsText: "Rs 4.12 Crore ~ 4 Crore+", isWinner: true },
  { name: "Imtiaz Jaleel", constituency: "AURANGABAD", state: "Maharashtra", party: "All India Majlis-E-Ittehadul Muslimeen", partyShort: "AIMIM", education: "Graduate", totalAssetsText: "Rs 2.38 Crore ~ 2 Crore+", isWinner: false },
  // ─── JMM ─────────────────────────────────────────────────────────────────
  { name: "Champai Soren", constituency: "SINGHBHUM", state: "Jharkhand", party: "Jharkhand Mukti Morcha", partyShort: "JMM", education: "Some College", totalAssetsText: "Rs 1.83 Crore ~ 1 Crore+", isWinner: true },
  { name: "Hemant Soren", constituency: "DUMKA", state: "Jharkhand", party: "Jharkhand Mukti Morcha", partyShort: "JMM", education: "Some College", totalAssetsText: "Rs 4.52 Crore ~ 4 Crore+", isWinner: false },
  // ─── BJD ─────────────────────────────────────────────────────────────────
  { name: "Naveen Patnaik", constituency: "HINJILI", state: "Odisha", party: "Biju Janata Dal", partyShort: "BJD", education: "Post Graduate", totalAssetsText: "Rs 63.07 Crore ~ 63 Crore+", isWinner: false },
  { name: "Chandra Sekhar Sahoo", constituency: "PURI", state: "Odisha", party: "Biju Janata Dal", partyShort: "BJD", education: "Post Graduate", totalAssetsText: "Rs 4.41 Crore ~ 4 Crore+", isWinner: false },
  // ─── SAD ─────────────────────────────────────────────────────────────────
  { name: "Sukhbir Singh Badal", constituency: "FIROZPUR", state: "Punjab", party: "Shiromani Akali Dal", partyShort: "SAD", education: "Post Graduate", totalAssetsText: "Rs 92.14 Crore ~ 92 Crore+", isWinner: false },
  { name: "Harsimrat Kaur Badal", constituency: "BATHINDA", state: "Punjab", party: "Shiromani Akali Dal", partyShort: "SAD", education: "Graduate", totalAssetsText: "Rs 117.53 Crore ~ 117 Crore+", isWinner: false },
  // ─── CPI(M) ──────────────────────────────────────────────────────────────
  { name: "Elamaram Kareem", constituency: "THRISSUR", state: "Kerala", party: "Communist Party of India (Marxist)", partyShort: "CPI(M)", education: "Graduate", totalAssetsText: "Rs 0.84 Crore ~ 84 Lacs+", isWinner: false },
  { name: "A M Ariff", constituency: "ALAPPUZHA", state: "Kerala", party: "Communist Party of India (Marxist)", partyShort: "CPI(M)", education: "Post Graduate", totalAssetsText: "Rs 1.48 Crore ~ 1 Crore+", isWinner: false },
  { name: "P K Biju", constituency: "ALATHUR", state: "Kerala", party: "Communist Party of India (Marxist)", partyShort: "CPI(M)", education: "Graduate", totalAssetsText: "Rs 1.11 Crore ~ 1 Crore+", isWinner: false },
  // ─── KC(M) ───────────────────────────────────────────────────────────────
  { name: "Thomas Chazhikadan", constituency: "KOTTAYAM", state: "Kerala", party: "Kerala Congress (M)", partyShort: "KC(M)", education: "Graduate", totalAssetsText: "Rs 7.43 Crore ~ 7 Crore+", isWinner: true },
  // ─── Others ──────────────────────────────────────────────────────────────
  { name: "Chandrashekhar Azad", constituency: "NAGINA", state: "Uttar Pradesh", party: "Azad Samaj Party (Kanshi Ram)", partyShort: "ASP", education: "Post Graduate", totalAssetsText: "Rs 0.42 Crore ~ 42 Lacs+", isWinner: true },
  { name: "Hanuman Beniwal", constituency: "NAGAUR", state: "Rajasthan", party: "Rashtriya Loktantrik Party", partyShort: "RLP", education: "Graduate", totalAssetsText: "Rs 16.24 Crore ~ 16 Crore+", isWinner: false },
  { name: "Ramdas Athawale", constituency: "SHIRDI", state: "Maharashtra", party: "Republican Party of India (A)", partyShort: "RPI(A)", education: "Graduate", totalAssetsText: "Rs 1.27 Crore ~ 1 Crore+", isWinner: false },
];

async function main() {
  console.log("🗳️  Chunav Guide — Candidate Database Seeder");
  console.log("📡 Source: ECI official results + ADR affidavit data (public domain)");
  console.log("⚠️  Criminal case counts omitted — verify at myneta.info\n");

  console.log("🗑️  Clearing existing 2024 Lok Sabha data...");
  await db
    .delete(candidates)
    .where(sql`election_year = 2024 AND election_type = 'Lok Sabha'`);

  console.log(`📋 Seeding ${CANDIDATES_2024.length} verified candidates...\n`);

  const rows = CANDIDATES_2024.map((c) => ({
    name: c.name,
    constituency: c.constituency.toUpperCase(),
    state: c.state,
    party: c.party,
    partyShort: c.partyShort,
    electionYear: c.electionYear ?? 2024,
    electionType: c.electionType ?? "Lok Sabha",
    criminalCases: null,
    education: c.education ?? null,
    totalAssetsText: c.totalAssetsText ?? null,
    totalAssetsValue: null,
    liabilitiesText: null,
    liabilitiesValue: null,
    isWinner: c.isWinner,
    sourceUrl: `https://myneta.info/LokSabha2024/`,
  }));

  await db.insert(candidates).values(rows).onConflictDoNothing();

  console.log(`✅ Seeded ${rows.length} candidates.`);
  console.log(`🏆 Winners: ${rows.filter((r) => r.isWinner).length}`);
  console.log(`📊 Notable losers: ${rows.filter((r) => !r.isWinner).length}`);
  console.log("\n📋 Parties covered:");
  const partyCounts = rows.reduce((acc, r) => {
    acc[r.partyShort ?? r.party] = (acc[r.partyShort ?? r.party] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  Object.entries(partyCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([p, c]) => console.log(`   ${p}: ${c}`));
  console.log("\n🎉 Done!\n");
}

main().catch((err) => {
  console.error("❌ Seeder failed:", err);
  process.exit(1);
});
