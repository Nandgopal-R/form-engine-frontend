import * as React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Star, DollarSign, Percent, CreditCard, ChevronDown, CloudUpload, Search, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"

import { cn } from "@/lib/utils"

export interface CanvasField {
    id: string
    type: string
    label: string
    placeholder?: string
    required?: boolean
    options?: string[]
}

interface FieldPreviewProps {
    field: CanvasField
    onRemove?: (id: string) => void
    selected?: boolean
    onSelect?: (id: string) => void
}

// Theme Definitions for different field categories
// Theme Definitions for different field categories (Unique Colors per Type)
const getFieldTheme = (type: string) => {
    switch (type) {
        case "text":
            return {
                card: "bg-blue-950/40 border-blue-500/30 hover:border-blue-400/80 shadow-lg shadow-blue-900/20",
                active: "border-blue-400/90 ring-1 ring-blue-400/80 shadow-blue-500/50 bg-blue-950/80",
                hover: "hover:shadow-blue-500/40 hover:bg-blue-900/20",
                icon: "bg-blue-500/20 text-blue-300",
                glow: "from-blue-600/30 to-cyan-600/30",
                text: "text-blue-100",
                muted: "text-blue-200/50"
            }
        case "textarea":
            return {
                card: "bg-slate-950/40 border-slate-500/30 hover:border-slate-400/80 shadow-lg shadow-slate-900/20",
                active: "border-slate-400/90 ring-1 ring-slate-400/80 shadow-slate-500/50 bg-slate-950/80",
                hover: "hover:shadow-slate-500/40 hover:bg-slate-900/20",
                icon: "bg-slate-500/20 text-slate-300",
                glow: "from-slate-600/30 to-gray-600/30",
                text: "text-slate-100",
                muted: "text-slate-200/50"
            }
        case "email":
            return {
                card: "bg-indigo-950/40 border-indigo-500/30 hover:border-indigo-400/80 shadow-lg shadow-indigo-900/20",
                active: "border-indigo-400/90 ring-1 ring-indigo-400/80 shadow-indigo-500/50 bg-indigo-950/80",
                hover: "hover:shadow-indigo-500/40 hover:bg-indigo-900/20",
                icon: "bg-indigo-500/20 text-indigo-300",
                glow: "from-indigo-600/30 to-violet-600/30",
                text: "text-indigo-100",
                muted: "text-indigo-200/50"
            }
        case "phone":
            return {
                card: "bg-cyan-950/40 border-cyan-500/30 hover:border-cyan-400/80 shadow-lg shadow-cyan-900/20",
                active: "border-cyan-400/90 ring-1 ring-cyan-400/80 shadow-cyan-500/50 bg-cyan-950/80",
                hover: "hover:shadow-cyan-500/40 hover:bg-cyan-900/20",
                icon: "bg-cyan-500/20 text-cyan-300",
                glow: "from-cyan-600/30 to-teal-600/30",
                text: "text-cyan-100",
                muted: "text-cyan-200/50"
            }
        case "url":
            return {
                card: "bg-sky-950/40 border-sky-500/30 hover:border-sky-400/80 shadow-lg shadow-sky-900/20",
                active: "border-sky-400/90 ring-1 ring-sky-400/80 shadow-sky-500/50 bg-sky-950/80",
                hover: "hover:shadow-sky-500/40 hover:bg-sky-900/20",
                icon: "bg-sky-500/20 text-sky-300",
                glow: "from-sky-600/30 to-blue-600/30",
                text: "text-sky-100",
                muted: "text-sky-200/50"
            }
        case "password":
            return {
                card: "bg-red-950/40 border-red-500/30 hover:border-red-400/80 shadow-lg shadow-red-900/20",
                active: "border-red-400/90 ring-1 ring-red-400/80 shadow-red-500/50 bg-red-950/80",
                hover: "hover:shadow-red-500/40 hover:bg-red-900/20",
                icon: "bg-red-500/20 text-red-300",
                glow: "from-red-600/30 to-rose-600/30",
                text: "text-red-100",
                muted: "text-red-200/50"
            }
        case "number":
            return {
                card: "bg-lime-950/40 border-lime-500/30 hover:border-lime-400/80 shadow-lg shadow-lime-900/20",
                active: "border-lime-400/90 ring-1 ring-lime-400/80 shadow-lime-500/50 bg-lime-950/80",
                hover: "hover:shadow-lime-500/40 hover:bg-lime-900/20",
                icon: "bg-lime-500/20 text-lime-300",
                glow: "from-lime-600/30 to-green-600/30",
                text: "text-lime-100",
                muted: "text-lime-200/50"
            }
        case "file":
            return {
                card: "bg-violet-950/40 border-violet-500/30 hover:border-violet-400/80 shadow-lg shadow-violet-900/20",
                active: "border-violet-400/90 ring-1 ring-violet-400/80 shadow-violet-500/50 bg-violet-950/80",
                hover: "hover:shadow-violet-500/40 hover:bg-violet-900/20",
                icon: "bg-violet-500/20 text-violet-300",
                glow: "from-violet-600/30 to-purple-600/30",
                text: "text-violet-100",
                muted: "text-violet-200/50"
            }
        case "image":
            return {
                card: "bg-fuchsia-950/40 border-fuchsia-500/30 hover:border-fuchsia-400/80 shadow-lg shadow-fuchsia-900/20",
                active: "border-fuchsia-400/90 ring-1 ring-fuchsia-400/80 shadow-fuchsia-500/50 bg-fuchsia-950/80",
                hover: "hover:shadow-fuchsia-500/40 hover:bg-fuchsia-900/20",
                icon: "bg-fuchsia-500/20 text-fuchsia-300",
                glow: "from-fuchsia-600/30 to-pink-600/30",
                text: "text-fuchsia-100",
                muted: "text-fuchsia-200/50"
            }
        case "date":
            return {
                card: "bg-rose-950/40 border-rose-500/30 hover:border-rose-400/80 shadow-lg shadow-rose-900/20",
                active: "border-rose-400/90 ring-1 ring-rose-400/80 shadow-rose-500/50 bg-rose-950/80",
                hover: "hover:shadow-rose-500/40 hover:bg-rose-900/20",
                icon: "bg-rose-500/20 text-rose-300",
                glow: "from-rose-600/30 to-red-600/30",
                text: "text-rose-100",
                muted: "text-rose-200/50"
            }
        case "time":
            return {
                card: "bg-amber-950/40 border-amber-500/30 hover:border-amber-400/80 shadow-lg shadow-amber-900/20",
                active: "border-amber-400/90 ring-1 ring-amber-400/80 shadow-amber-500/50 bg-amber-950/80",
                hover: "hover:shadow-amber-500/40 hover:bg-amber-900/20",
                icon: "bg-amber-500/20 text-amber-300",
                glow: "from-amber-600/30 to-orange-600/30",
                text: "text-amber-100",
                muted: "text-amber-200/50"
            }
        case "datetime":
            return {
                card: "bg-orange-950/40 border-orange-500/30 hover:border-orange-400/80 shadow-lg shadow-orange-900/20",
                active: "border-orange-400/90 ring-1 ring-orange-400/80 shadow-orange-500/50 bg-orange-950/80",
                hover: "hover:shadow-orange-500/40 hover:bg-orange-900/20",
                icon: "bg-orange-500/20 text-orange-300",
                glow: "from-orange-600/30 to-red-600/30",
                text: "text-orange-100",
                muted: "text-orange-200/50"
            }
        case "multi-select":
            return {
                card: "bg-emerald-950/40 border-emerald-500/30 hover:border-emerald-400/80 shadow-lg shadow-emerald-900/20",
                active: "border-emerald-400/90 ring-1 ring-emerald-400/80 shadow-emerald-500/50 bg-emerald-950/80",
                hover: "hover:shadow-emerald-500/40 hover:bg-emerald-900/20",
                icon: "bg-emerald-500/20 text-emerald-300",
                glow: "from-emerald-600/30 to-green-600/30",
                text: "text-emerald-100",
                muted: "text-emerald-200/50"
            }
        case "dropdown":
            return {
                card: "bg-teal-950/40 border-teal-500/30 hover:border-teal-400/80 shadow-lg shadow-teal-900/20",
                active: "border-teal-400/90 ring-1 ring-teal-400/80 shadow-teal-500/50 bg-teal-950/80",
                hover: "hover:shadow-teal-500/40 hover:bg-teal-900/20",
                icon: "bg-teal-500/20 text-teal-300",
                glow: "from-teal-600/30 to-cyan-600/30",
                text: "text-teal-100",
                muted: "text-teal-200/50"
            }
        case "checkbox-group":
            return {
                card: "bg-green-950/40 border-green-500/30 hover:border-green-400/80 shadow-lg shadow-green-900/20",
                active: "border-green-400/90 ring-1 ring-green-400/80 shadow-green-500/50 bg-green-950/80",
                hover: "hover:shadow-green-500/40 hover:bg-green-900/20",
                icon: "bg-green-500/20 text-green-300",
                glow: "from-green-600/30 to-emerald-600/30",
                text: "text-green-100",
                muted: "text-green-200/50"
            }
        case "radio":
            return {
                card: "bg-yellow-950/40 border-yellow-500/30 hover:border-yellow-400/80 shadow-lg shadow-yellow-900/20",
                active: "border-yellow-400/90 ring-1 ring-yellow-400/80 shadow-yellow-500/50 bg-yellow-950/80",
                hover: "hover:shadow-yellow-500/40 hover:bg-yellow-900/20",
                icon: "bg-yellow-500/20 text-yellow-300",
                glow: "from-yellow-600/30 to-amber-600/30",
                text: "text-yellow-100",
                muted: "text-yellow-200/50"
            }
        case "slider":
        case "range":
            return {
                card: "bg-pink-950/40 border-pink-500/30 hover:border-pink-400/80 shadow-lg shadow-pink-900/20",
                active: "border-pink-400/90 ring-1 ring-pink-400/80 shadow-pink-500/50 bg-pink-950/80",
                hover: "hover:shadow-pink-500/40 hover:bg-pink-900/20",
                icon: "bg-pink-500/20 text-pink-300",
                glow: "from-pink-600/30 to-rose-600/30",
                text: "text-pink-100",
                muted: "text-pink-200/50"
            }
        case "rating":
            return {
                card: "bg-yellow-950/40 border-yellow-500/30 hover:border-yellow-400/80 shadow-lg shadow-yellow-900/20",
                active: "border-yellow-400/90 ring-1 ring-yellow-400/80 shadow-yellow-500/50 bg-yellow-950/80",
                hover: "hover:shadow-yellow-500/40 hover:bg-yellow-900/20",
                icon: "bg-yellow-500/20 text-yellow-300",
                glow: "from-yellow-600/30 to-gold-600/30",
                text: "text-yellow-100",
                muted: "text-yellow-200/50"
            }
        case "switch":
        case "checkbox":
            return {
                card: "bg-purple-950/40 border-purple-500/30 hover:border-purple-400/80 shadow-lg shadow-purple-900/20",
                active: "border-purple-400/90 ring-1 ring-purple-400/80 shadow-purple-500/50 bg-purple-950/80",
                hover: "hover:shadow-purple-500/40 hover:bg-purple-900/20",
                icon: "bg-purple-500/20 text-purple-300",
                glow: "from-purple-600/30 to-fuchsia-600/30",
                text: "text-purple-100",
                muted: "text-purple-200/50"
            }
        default:
            return {
                card: "bg-gray-950/40 border-white/10 hover:border-white/40 shadow-2xl shadow-white/5",
                active: "border-white/60 ring-1 ring-white/40 shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] bg-black",
                hover: "hover:shadow-white/10 hover:-translate-y-1 hover:scale-[1.01]",
                icon: "bg-white/10 text-white",
                glow: "from-white/10 to-gray-400/10",
                text: "text-white",
                muted: "text-gray-400"
            }
    }
}

export function FieldPreview({ field, onRemove, selected, onSelect }: FieldPreviewProps) {
    const theme = getFieldTheme(field.type)

    return (
        <Card
            className={cn(
                "p-6 group relative border rounded-2xl cursor-pointer transition-all duration-500 ease-out overflow-hidden backdrop-blur-xl",
                theme.card,
                // Specific Theme Styles
                selected
                    ? cn("z-10 scale-[1.02]", theme.active)
                    : cn("bg-opacity-60", theme.hover)
            )}
            onClick={(e) => {
                e.stopPropagation()
                onSelect?.(field.id)
            }}
        >
            {/* Dark Mode Neon Glow */}
            <div className={cn("absolute -top-[50%] -right-[50%] w-[150%] h-[150%] rounded-full bg-gradient-to-br blur-3xl opacity-20 pointer-events-none transition-all duration-1000", theme.glow, selected ? "opacity-30 rotate-180 scale-110" : "group-hover:opacity-30")} />

            <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10 hover:text-white z-20 rounded-xl shadow-sm hover:shadow-md hover:scale-105"
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove?.(field.id)
                }}
            >
                <Trash2 className="h-4 w-4 text-white/70" />
            </Button>

            <div className="relative space-y-4 z-10 p-1">
                <div className="flex items-center gap-2 mb-2">
                    <Label className={cn("text-base font-semibold tracking-tight transition-colors", theme.text)}>{field.label}</Label>
                    {field.required && <span className="text-red-400 font-bold text-lg leading-3">*</span>}
                </div>
                {renderFieldInput(field)}
            </div>
        </Card>
    )
}

const LOCATION_DATA: Record<string, { states: string[], cities: Record<string, string[]> }> = {
    "India": {
        states: [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
            "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
            "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala",
            "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
            "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
            "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
        ],
        cities: {
            "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kadapa", "Kakinada", "Anantapur", "Vizianagaram", "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Proddatur", "Chittoor", "Hindupur", "Bhimavaram", "Madanapalle", "Guntakal", "Dharmavaram", "Gudivada", "Srikakulam", "Narasaraopet", "Tadipatri", "Tadepalligudem", "Amaravati", "Chilakaluripet", "Kavali", "Narsapuram", "Gudur", "Macherla", "Sattenapalle", "Pithapuram", "Bapatla", "Palasa", "Parvathipuram", "Rayachoti", "Sullurpeta", "Tuni", "Yemmiganur", "Mandapeta", "Nagari", "Punganur", "Vinukonda", "Markapur", "Kandukur", "Chirala", "Venkatagiri", "Repalle"],
            "Arunachal Pradesh": ["Itanagar", "Tawang", "Pasighat", "Ziro", "Bomdila", "Naharlagun", "Roing", "Tezu", "Khonsa", "Aalo", "Yingkiong", "Seppa", "Daporijo", "Changlang", "Basar", "Dirang", "Koloriang", "Miao", "Namsai"],
            "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Diphu", "Dhubri", "North Lakhimpur", "Karimganj", "Sivasagar", "Goalpara", "Barpeta", "Lanka", "Hojai", "Kokrajhar", "Hailakandi", "Morigaon", "Nalbari", "Rangia", "Mangaldoi", "Dergaon", "Dhekiajuli", "Doomdooma", "Golaghat", "Lakhipur", "Margherita", "Nazira", "Sarthebari", "Titabar", "Udalguri"],
            "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Begusarai", "Katihar", "Munger", "Chhapra", "Danapur", "Saharsa", "Hajipur", "Sasaram", "Dehri", "Siwan", "Bettiah", "Motihari", "Bagaha", "Jamalpur", "Arrah", "Buxar", "Aurangabad", "Jehanabad", "Lakhisarai", "Nawada", "Kishanganj", "Samastipur", "Sitamarhi", "Madhubani", "Gopalganj", "Supaul", "Sheikhpura", "Araria", "Bhabua", "Masaurhi", "Mokama", "Sultanganj", "Raxaul", "Dumraon", "Khagaria", "Jhanjharpur"],
            "Chandigarh": ["Chandigarh"],
            "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari", "Chirmiri", "Mahasamund", "Bhatapara", "Dalli-Rajhara", "Kanker", "Manendragarh", "Kawardha", "Sakti", "Tilda Newra", "Mungeli", "Dongargarh", "Gobranawapara", "Bemetara", "Kondagaon", "Jashpurnagar"],
            "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Dadra"],
            "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Dwarka", "Rohini", "Saket", "Vasant Kunj", "Connaught Place", "Lajpat Nagar", "Karol Bagh", "Chandni Chowk", "Pitampura", "Janakpuri", "Mayur Vihar", "Okhla", "Nehru Place", "Hauz Khas", "Shahdara", "Najafgarh", "Narela", "Mehrauli", "Greater Kailash", "Defence Colony", "Vasant Vihar", "Model Town", "Ashok Vihar", "Punjabi Bagh", "Paschim Vihar"],
            "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanguem", "Canacona", "Pernem", "Valpoi", "Quepem", "Sanquelim"],
            "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", "Bharuch", "Mehsana", "Bhuj", "Porbandar", "Palanpur", "Valsad", "Vapi", "Gondal", "Veraval", "Godhra", "Patan", "Kalol", "Botad", "Amreli", "Deesa", "Jetpur", "Khambhat", "Mahuva", "Dhoraji", "Keshod", "Wadhwan", "Anjar", "Savarkundla", "Visnagar", "Dhrangadhra", "Kadi", "Dehgam", "Modasa", "Siddhpur", "Vyara", "Mangrol"],
            "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Palwal", "Hansi", "Narnaul", "Fatehabad", "Gohana", "Tohana", "Narwana", "Mandi Dabwali", "Charkhi Dadri", "Pehowa", "Shahbad", "Jhajjar", "Sohna", "Mahendragarh", "Kalka", "Cheeka", "Gharaunda", "Assandh"],
            "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi", "Baddi", "Nahan", "Paonta Sahib", "Sundarnagar", "Chamba", "Una", "Kullu", "Hamirpur", "Bilaspur", "Nurpur", "Palampur", "Kangra", "Jogindernagar", "Nalagarh", "Parwanoo", "Dalhousie", "Rohru", "Theog", "Sarkaghat"],
            "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua", "Sopore", "Bandipora", "Poonch", "Kupwara", "Pulwama", "Kishtwar", "Rajouri", "Doda", "Samba", "Reasi", "Ramban", "Ganderbal", "Kulgam", "Shopian", "Akhnoor", "Bishnah", "Hiranagar", "Nowshera"],
            "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh", "Medininagar", "Chirkunda", "Phusro", "Jhumri Tilaiya", "Chaibasa", "Sahibganj", "Lohardaga", "Chatra", "Dumka", "Garhwa", "Pakur", "Simdega", "Latehar", "Godda", "Jamtara", "Khunti", "Gumla", "Adityapur", "Mango"],
            "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Bijapur", "Shimoga", "Tumkur", "Raichur", "Bidar", "Hospet", "Hassan", "Gadag", "Udupi", "Robertson Pet", "Bhadravati", "Chitradurga", "Kolar", "Mandya", "Chikmagalur", "Gangavati", "Bagalkot", "Ranebennur", "Haveri", "Karwar", "Yadgir", "Koppal", "Sirsi", "Dharwad", "Ramanagara", "Gokak", "Chikkaballapur", "Rabkavi Banhatti", "Shahabad", "Nipani", "Puttur", "Athni", "Dandeli", "Sira", "Bhatkal", "Kundapura"],
            "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Malappuram", "Kannur", "Manjeri", "Thalassery", "Ponnani", "Vatakara", "Kanhangad", "Payyanur", "Koyilandy", "Parappanangadi", "Kalamassery", "Kodungallur", "Neyyattinkara", "Tanur", "Kayamkulam", "Changanassery", "Kasaragod", "Tirur", "Kunnamkulam", "Ottapalam", "Thiruvalla", "Chalakudy", "Perinthalmanna", "Nedumangad", "Adoor", "Mavelikkara", "Attingal", "Irinjalakuda", "Varkala", "Kottarakkara", "Shoranur", "Nilambur", "Punalur", "Cherthala", "Mattannur"],
            "Ladakh": ["Leh", "Kargil", "Diskit", "Padum"],
            "Lakshadweep": ["Kavaratti", "Andrott", "Minicoy", "Amini", "Agatti"],
            "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Damoh", "Chhatarpur", "Mandsaur", "Khargone", "Neemuch", "Pithampur", "Hoshangabad", "Itarsi", "Sehore", "Betul", "Seoni", "Datia", "Nagda", "Dhar", "Balaghat", "Tikamgarh", "Shahdol", "Ashoknagar", "Jhabua", "Harda", "Sheopur", "Shajapur", "Narsinghpur", "Panna", "Mandla", "Raisen", "Sidhi", "Barwani", "Rajgarh", "Morena"],
            "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Thane", "Amravati", "Navi Mumbai", "Kolhapur", "Akola", "Jalgaon", "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Ichalkaranji", "Jalna", "Ambarnath", "Bhusawal", "Panvel", "Badlapur", "Beed", "Gondia", "Satara", "Barshi", "Yavatmal", "Achalpur", "Osmanabad", "Nandurbar", "Wardha", "Udgir", "Hinganghat", "Washim", "Palghar", "Ratnagiri", "Sangli", "Miraj", "Bhiwandi", "Kalyan-Dombivli", "Vasai-Virar", "Ulhasnagar", "Malegaon", "Nanded", "Pimpri-Chinchwad", "Mira-Bhayandar", "Virar", "Karjat", "Karad", "Pandharpur", "Shirpur", "Warora", "Yevla", "Manmad", "Sillod", "Arvi", "Murtijapur", "Dahanu", "Khamgaon", "Malkapur", "Lonar", "Akot", "Shegaon", "Chalisgaon", "Amalner", "Parli", "Hingoli", "Ausa", "Tuljapur", "Mangalvedha", "Solapur", "Baramati", "Daund", "Junnar", "Saswad", "Talegaon Dabhade", "Lonavala", "Khadki", "Dehu Road", "Chakan", "Alandi", "Pen", "Alibag", "Roha", "Khopoli", "Matheran", "Mahabaleshwar", "Panchgani", "Chiplun", "Khed", "Sawantwadi", "Malvan", "Vengurla", "Kankavli", "Sangamner", "Kopargaon", "Shrirampur", "Rahuri", "Shirdi", "Pathardi", "Shevgaon", "Karjat", "Jamkhed", "Ahmednagar", "Akole", "Igatpuri", "Trimbak", "Sinnar", "Yeola", "Niphad", "Satana", "Malegaon", "Nandgaon", "Bhusawal", "Chalisgaon", "Pachora", "Raver", "Yawal", "Erandol", "Parola", "Amalner", "Chopda", "Jamner", "Bodwad", "Muktainagar", "Nandura", "Shegaon", "Khamgaon", "Malkapur", "Jalgaon Jamod", "Sangrampur", "Warud", "Morshi", "Chandur", "Dhamangaon", "Nandgaon Khandeshwar", "Anjangaon", "Daryapur", "Achalpur", "Chikhalc"],
            "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Kakching", "Ukhrul", "Bishnupur", "Senapati", "Tamenglong", "Jiribam", "Moreh", "Noney", "Kangpokpi"],
            "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Nongpoh", "Baghmara", "Mairang", "Resubelpara"],
            "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit"],
            "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Mon", "Kiphire", "Longleng", "Peren"],
            "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Jeypore", "Bargarh", "Rayagada", "Bolangir", "Kendujhar", "Bhawanipatna", "Paralakhemundi", "Dhenkanal", "Barbil", "Paradeep", "Jajpur", "Angul", "Titlagarh", "Talcher", "Sundargarh", "Phulbani", "Patnagarh", "Koraput", "Kendrapara", "Jagatsinghpur", "Hirakud", "Gunupur", "Duburi", "Brajrajnagar", "Belpahar", "Basudevpur", "Anandapur"],
            "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam", "Ozhukarai", "Villianur"],
            "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Phagwara", "Muktsar", "Barnala", "Firozpur", "Kapurthala", "Rajpura", "Sunam", "Mansa", "Fazilka", "Gurdaspur", "Sangrur", "Nawanshahr", "Rupnagar", "Samana", "Jagraon", "Faridkot", "Tarn Taran", "Nakodar", "Zirakpur", "Kharar", "Kot Kapura", "Nabha", "Patti", "Doraha", "Dhuri", "Gobindgarh", "Jalalabad", "Malout", "Morinda", "Nangal", "Nayagaon", "Pathankot"],
            "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Bhiwadi", "Hanumangarh", "Beawar", "Tonk", "Kishangarh", "Jhunjhunu", "Chittorgarh", "Sawai Madhopur", "Dholpur", "Gangapur City", "Churu", "Baran", "Jhalawar", "Makrana", "Nagaur", "Banswara", "Dausa", "Dungarpur", "Karauli", "Pratapgarh", "Rajsamand", "Sirohi", "Barmer", "Jaisalmer", "Balotra", "Bundi", "Fatehpur", "Hindaun", "Jalore", "Kuchaman City", "Ladnu", "Nimbahera", "Nokha", "Pilani", "Phalodi", "Ratangarh", "Sardarshahar", "Sujangarh", "Suratgarh"],
            "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Jorethang", "Nayabazar"],
            "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode", "Thoothukudi", "Dindigul", "Thanjavur", "Ranipet", "Sivakasi", "Karur", "Udhagamandalam", "Hosur", "Nagercoil", "Kanchipuram", "Kumarapalayam", "Karaikudi", "Neyveli", "Cuddalore", "Kumbakonam", "Tiruvannamalai", "Pollachi", "Rajapalayam", "Gudiyatham", "Pudukkottai", "Vaniyambadi", "Ambur", "Nagapattinam", "Namakkal", "Theni", "Dharmapuri", "Viluppuram", "Virudhunagar", "Chengalpattu", "Tenkasi", "Tiruppur", "Avadi", "Tambaram", "Tirupathur", "Ramanathapuram", "Mayiladuthurai", "Aruppukottai", "Gobichettipalayam", "Mannargudi", "Arani", "Attur", "Chidambaram", "Dharapuram", "Kovilpatti", "Mettupalayam", "Mettur", "Palani", "Paramakudi", "Pattukkottai", "Perambalur", "Sankarankovil", "Sirkazhi", "Srivilliputhur", "Theni Allinagaram", "Tindivanam", "Tiruchengode", "Tirunelveli", "Tirupathur", "Tiruvarur", "Vandavasi", "Virudhachalam"],
            "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Miryalaguda", "Jagtial", "Mancherial", "Kothagudem", "Siddipet", "Wanaparthy", "Kamareddy", "Sanga Reddy", "Vikarabad", "Medak", "Nirmal", "Bhadrachalam", "Bodhan", "Gadwal", "Jangaon", "Kagaznagar", "Koratla", "Mandamarri", "Metpally", "Palwancha", "Sircilla", "Tandur", "Vikarabad", "Yellandu", "Zahirabad"],
            "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Khowai", "Ambassa", "Teliamura", "Kumarghat", "Sonamura", "Bishalgarh", "Melaghar"],
            "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida", "Ghaziabad", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura-Vrindavan", "Budaun", "Rampur", "Shahjahanpur", "Ayodhya", "Hapur", "Etawah", "Mirzapur", "Bulandshahr", "Sambhal", "Amroha", "Hardoi", "Fatehpur", "Raebareli", "Orai", "Sitapur", "Bahraich", "Modinagar", "Unnao", "Jaunpur", "Lakhimpur", "Hathras", "Banda", "Pilibhit", "Mughalsarai", "Barabanki", "Mainpuri", "Lalitpur", "Deoria", "Ghazipur", "Sultanpur", "Azamgarh", "Bijnor", "Basti", "Chandausi", "Gonda", "Mest", "Badaun", "Kasganj", "Shamli", "Khurja", "Amethi", "Baghpat", "Bhadohi", "Chitrakoot", "Kannauj", "Kaushambi", "Maharajganj", "Mahoba", "Mau", "Siddharthnagar", "Shravasti", "Sonbhadra", "Auraiya", "Balrampur", "Chandauli", "Etah", "Farrukhabad", "Hamirpur", "Jalaun", "Kanpur Dehat", "Kushinagar", "Pratapgarh", "Sant Kabir Nagar"],
            "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh", "Rudrapur", "Kashipur", "Ramnagar", "Mussourie", "Nainital", "Almora", "Pithoragarh", "Srinagar", "Kichha", "Kotdwar", "Tehri", "Bageshwar", "Champawat", "Joshimath", "Manglaur", "Pauri", "Sitarganj", "Tanakpur", "Uttarkashi"],
            "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Bardhaman", "Baharampur", "Habra", "Kharagpur", "Shantipur", "Dankuni", "Dhulian", "Ranaghat", "Haldia", "Raiganj", "Krishnanagar", "Nabadwip", "Medinipur", "Jalpaiguri", "Balurghat", "Basirhat", "Bankura", "Chakdaha", "Darjeeling", "Alipurduar", "Purulia", "Jangipur", "Bangaon", "Cooch Behar", "Malda", "Suri", "Bolpur", "Arambagh", "Kalimpong", "Bishnupur", "Arambag", "Ashoknagar Kalyangarh", "Baidyabati", "Bansberia", "Baranagar", "Barasat", "Barrackpore", "Basirhat", "Belgharia", "Bhadreswar", "Bhatpara", "Bidhannagar", "Birnagar", "Budge Budge", "Champdani", "Chandannagar", "Contai", "Dainhat", "Dum Dum", "Egra", "Gangarampur", "Garulia", "Gayespur", "Ghatal", "Guskara", "Halisahar", "Hooghly-Chinsurah", "Islampur", "Jamuria", "Jaynagar Mazilpur", "Jhargram", "Jiaganj Azimganj", "Kaliaganj", "Kalyani", "Kamarhati", "Kanchrapara", "Kandi", "Katwa", "Khardaha", "Kolkata", "Konnagar", "Kurseong", "Madhyamgram", "Maheshtala", "Memari", "Mirik", "Murshidabad", "Naihati", "New Barrackpore", "North Barrackpore", "North Dumdum", "Old Malda", "Panihati", "Pujali", "Raghunathpur", "Rajpur Sonarpur", "Rampurhat", "Rishra", "Sainthia", "Serampore", "South Dumdum", "Taki", "Tamluk", "Tarakeswar", "Titagarh", "Uluberia", "Uttarpara Kotrung"]
        }
    },
    "United States": {
        states: ["California", "New York", "Texas", "Florida", "Illinois", "Washington", "Ohio", "Georgia", "North Carolina", "Michigan"],
        cities: {
            "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
            "New York": ["New York City", "Buffalo", "Rochester", "Yonkers"],
            "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
            "Florida": ["Miami", "Orlando", "Jacksonville", "Tampa"],
            "Illinois": ["Chicago", "Aurora", "Naperville"]
        }
    },
    "United Kingdom": {
        states: ["England", "Scotland", "Wales", "Northern Ireland"],
        cities: {
            "England": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
            "Scotland": ["Glasgow", "Edinburgh", "Aberdeen"],
            "Wales": ["Cardiff", "Swansea"],
            "Northern Ireland": ["Belfast", "Derry"]
        }
    }
}

const COUNTRIES = [...Object.keys(LOCATION_DATA), "Australia", "Canada", "Germany", "France", "Japan", "Brazil", "Other"]

function renderFieldInput(field: CanvasField) {
    const { type, placeholder, options } = field
    // DARK MODE INPUT STYLES
    const commonProps = {
        placeholder: placeholder || `Enter ${type}...`,
        className: "h-11 bg-white/5 backdrop-blur-md border-white/10 text-white placeholder:text-white/40 hover:border-white/20 hover:bg-white/10 focus:border-white/40 focus:ring-4 focus:ring-white/5 transition-all duration-300 shadow-inner rounded-xl"
    }

    const [isValidEmail, setIsValidEmail] = React.useState(true)
    const [phoneValue, setPhoneValue] = React.useState("")
    const [isValidPassword, setIsValidPassword] = React.useState(true)
    const [isValidUrl, setIsValidUrl] = React.useState(true)
    const [isMultiSelectOpen, setIsMultiSelectOpen] = React.useState(false)
    const [multiSelected, setMultiSelected] = React.useState<string[]>([])
    const [cardValue, setCardValue] = React.useState("")
    const [expiryValue, setExpiryValue] = React.useState("")
    const [cvcValue, setCvcValue] = React.useState("")
    const [isCardValid, setIsCardValid] = React.useState(true)
    const [zipValue, setZipValue] = React.useState("")

    // Address Field Dependencies
    const [addressCountry, setAddressCountry] = React.useState("")
    const [addressState, setAddressState] = React.useState("")
    const [addressCity, setAddressCity] = React.useState("")
    const [isPercentValid, setIsPercentValid] = React.useState(true)
    const [currencyValue, setCurrencyValue] = React.useState("")
    const [ratingValue, setRatingValue] = React.useState(0)
    const [sliderMin, setSliderMin] = React.useState(0)
    const [sliderMax, setSliderMax] = React.useState(100)

    // File Upload Refs & State
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const imageInputRef = React.useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = React.useState("")
    const [imageName, setImageName] = React.useState("")

    switch (type) {
        case "text":
            return <Input {...commonProps} />
        case "textarea":
            return <Textarea {...commonProps} className="min-h-[80px] bg-white/5 border-white/10 text-white placeholder:text-white/40 hover:border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/5 transition-all duration-200 shadow-sm rounded-xl resize-y" />
        case "email":
            return <Input
                type="email"
                {...commonProps}
                className={cn(commonProps.className, !isValidEmail ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : "")}
                onChange={(e) => {
                    const val = e.target.value
                    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                        setIsValidEmail(false)
                    } else {
                        setIsValidEmail(true)
                    }
                }}
            />
        case "phone":
            return <Input
                type="tel"
                {...commonProps}
                value={phoneValue}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setPhoneValue(val)
                }}
            />
        case "password":
            return <Input
                type="password"
                {...commonProps}
                className={cn(commonProps.className, !isValidPassword ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : "")}
                onChange={(e) => {
                    const val = e.target.value
                    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
                    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
                    if (val && !strongRegex.test(val)) {
                        setIsValidPassword(false)
                    } else {
                        setIsValidPassword(true)
                    }
                }}
            />
        case "url":
            return <Input
                type="url"
                {...commonProps}
                placeholder={placeholder || "https://example.com"}
                className={cn(commonProps.className, !isValidUrl ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : "")}
                onChange={(e) => {
                    const val = e.target.value
                    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
                    if (val && !urlRegex.test(val)) {
                        setIsValidUrl(false)
                    } else {
                        setIsValidUrl(true)
                    }
                }}
            />
        case "number":
            return <Input type="number" {...commonProps} />
        case "date":
            return <Input type="date" {...commonProps} />
        case "time":
            return (
                <div className="flex items-center gap-2 p-1.5 border border-white/10 rounded-xl bg-white/5 group/time hover:border-white/20 transition-colors cursor-text">
                    <Input
                        type="number"
                        placeholder="12"
                        className="w-14 text-center h-9 bg-transparent border-transparent text-white focus:border-white/20 hover:bg-white/5 shadow-none font-mono placeholder:text-white/30"
                        min={1}
                        max={12}
                        onChange={(e) => {
                            if (parseInt(e.target.value) > 12) e.target.value = "12"
                        }}
                    />
                    <span className="font-bold text-white/50 animate-pulse">:</span>
                    <Input
                        type="number"
                        placeholder="00"
                        className="w-14 text-center h-9 bg-background border-transparent focus:border-primary hover:bg-background/80 shadow-none font-mono"
                        min={0}
                        max={59}
                        onChange={(e) => {
                            if (parseInt(e.target.value) > 59) e.target.value = "59"
                        }}
                    />
                    <select className="h-9 w-18 rounded-lg border border-input/50 bg-background px-2 text-sm focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-accent/5">
                        <option>AM</option>
                        <option>PM</option>
                    </select>
                </div>
            )
        case "datetime":
            return (
                <div className="flex flex-col gap-3">
                    <Input type="date" className={commonProps.className} />
                    <div className="flex items-center gap-2 p-1.5 border border-white/10 rounded-xl bg-white/5 group/time hover:border-white/20 transition-colors">
                        <Input
                            type="number"
                            placeholder="12"
                            className="w-14 text-center h-9 bg-transparent border-transparent text-white focus:border-white/20 hover:bg-white/5 shadow-none font-mono placeholder:text-white/30"
                            min={1}
                            max={12}
                            onChange={(e) => {
                                if (parseInt(e.target.value) > 12) e.target.value = "12"
                            }}
                        />
                        <span className="font-bold text-white/50 animate-pulse">:</span>
                        <Input
                            type="number"
                            placeholder="00"
                            className="w-14 text-center h-9 bg-transparent border-transparent text-white focus:border-white/20 hover:bg-white/5 shadow-none font-mono placeholder:text-white/30"
                            min={0}
                            max={59}
                            onChange={(e) => {
                                if (parseInt(e.target.value) > 59) e.target.value = "59"
                            }}
                        />
                        <select className="h-9 w-18 rounded-lg border border-white/10 bg-slate-900 px-2 text-sm text-white focus:ring-2 focus:ring-white/20 cursor-pointer hover:bg-white/5">
                            <option>AM</option>
                            <option>PM</option>
                        </select>
                    </div>
                </div>
            )
        case "switch":
            return (
                <div className="flex items-center gap-3 p-3.5 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-sm transition-all duration-300 cursor-pointer group/switch">
                    <Switch id="switch-preview" className="data-[state=checked]:bg-orange-500 ring-offset-slate-950" />
                    <Label htmlFor="switch-preview" className="text-sm font-medium cursor-pointer flex-1 text-white/80 group-hover/switch:text-white">Toggle Option</Label>
                </div>
            )
        case "checkbox":
            if (options && options.length > 0) {
                return (
                    <div className="space-y-2">
                        {options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Checkbox id={`cb-${i}`} />
                                <Label htmlFor={`cb-${i}`} className="text-sm font-normal">{opt}</Label>
                            </div>
                        ))}
                    </div>
                )
            }
            return (
                <div className="flex items-center gap-2">
                    <Checkbox id="checkbox-preview" />
                    <Label htmlFor="checkbox-preview" className="text-sm font-normal">{placeholder || "Option"}</Label>
                </div>
            )
        case "checkbox-group":
            return (
                <div className="space-y-2">
                    {(options || ["Option 1", "Option 2", "Option 3"]).map((opt, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:bg-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer">
                            <Checkbox id={`cb-group-${i}`} className="data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white rounded-[4px] border-white/20" />
                            <Label htmlFor={`cb-group-${i}`} className="text-sm font-medium cursor-pointer text-white/80 flex-1">{opt}</Label>
                        </div>
                    ))}
                </div>
            )
        case "radio":
            return (
                <div className="space-y-2">
                    {(options || ["Option 1", "Option 2"]).map((opt, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:bg-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer group/radio">
                            <input
                                type="radio"
                                name="radio-preview"
                                id={`radio-${i}`}
                                className="h-4 w-4 text-emerald-500 border-white/30 focus:ring-emerald-500/20 bg-transparent"
                            />
                            <Label htmlFor={`radio-${i}`} className="text-sm font-medium cursor-pointer text-white/80 flex-1 group-hover/radio:text-white">{opt}</Label>
                        </div>
                    ))}
                </div>
            )
        case "dropdown":
            return (
                <div className="relative group/dropdown">
                    <select className="w-full h-10 px-3 pr-8 rounded-lg border border-white/10 bg-slate-900/50 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 shadow-sm appearance-none cursor-pointer hover:border-emerald-500/50">
                        <option className="bg-slate-900 text-white">{placeholder || "Select an option..."}</option>
                        {(options || ["Option 1", "Option 2"]).map((opt, i) => (
                            <option key={i} className="bg-slate-900 text-white">{opt}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-white/50 pointer-events-none group-hover/dropdown:text-emerald-400 transition-colors" />
                </div>
            )
        case "multi-select":
            const [searchQuery, setSearchQuery] = React.useState("")
            const filteredOptions = (options || ["Option 1", "Option 2", "Option 3", "Option 4"]).filter(opt =>
                opt.toLowerCase().includes(searchQuery.toLowerCase())
            )

            return (
                <div className="relative group/multiselect">
                    <div
                        className="flex flex-wrap items-center gap-2 w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-sm cursor-pointer hover:border-emerald-500/50 hover:bg-white/10 hover:shadow-[0_0_15px_-5px_rgba(16,185,129,0.1)] transition-all duration-300"
                        onClick={() => setIsMultiSelectOpen(!isMultiSelectOpen)}
                    >
                        {multiSelected.length > 0 ? (
                            multiSelected.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-semibold text-emerald-200 shadow-sm animate-in zoom-in-75 duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setMultiSelected(prev => prev.filter(p => p !== item))
                                    }}
                                >
                                    {item}
                                    <div className="bg-emerald-500/20 rounded-full p-0.5 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                                        <X className="h-2.5 w-2.5" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <span className="text-white/40 italic px-1">{placeholder || "Select options..."}</span>
                        )}
                        <ChevronDown className={`ml-auto h-4 w-4 text-white/50 transition-transform duration-500 ease-spring ${isMultiSelectOpen ? 'rotate-180 text-emerald-400 scale-110' : ''}`} />
                    </div>

                    {isMultiSelectOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 border border-white/10 rounded-2xl bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 overflow-hidden ring-1 ring-white/5">
                            <div className="flex items-center border-b border-white/10 px-3 py-2.5 bg-white/5">
                                <Search className="mr-2 h-4 w-4 shrink-0 text-white/40" />
                                <input
                                    className="flex h-9 w-full rounded-lg bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Type to filter..."
                                    value={searchQuery}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                                {filteredOptions.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-white/40 flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 text-white/10" />
                                        <p>No matches found</p>
                                    </div>
                                ) : (
                                    filteredOptions.map((opt, i) => {
                                        const isSelected = multiSelected.includes(opt)
                                        return (
                                            <div
                                                key={i}
                                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? "bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/20" : "hover:bg-white/5 hover:translate-x-1 text-white/80"}`}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (isSelected) {
                                                        setMultiSelected(prev => prev.filter(p => p !== opt))
                                                    } else {
                                                        setMultiSelected(prev => [...prev, opt])
                                                    }
                                                }}
                                            >
                                                <Checkbox id={`ms-${i}`} checked={isSelected} className="rounded-md data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white border-white/20" />
                                                <Label htmlFor={`ms-${i}`} className={`text-sm cursor-pointer flex-1 ${isSelected ? "text-emerald-300" : "text-white/80"}`}>{opt}</Label>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )
        case "file":
            return (
                <div className="relative overflow-hidden border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white/5 to-transparent gap-4 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-500 group/file cursor-pointer">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-0 group-hover/file:opacity-100 transition-opacity duration-700 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                    <div className="relative p-5 bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg shadow-violet-500/10 group-hover/file:scale-110 group-hover/file:shadow-violet-500/20 transition-all duration-500 ring-1 ring-white/10 group-hover/file:ring-violet-500/30">
                        <CloudUpload className="h-7 w-7 text-white/70 group-hover/file:text-violet-400 transition-colors duration-300" />
                    </div>
                    <div className="relative space-y-1.5 z-10">
                        <p className="text-sm font-bold text-white group-hover/file:text-violet-300 transition-colors duration-300">{fileName || "Click to Upload File"}</p>
                        <p className="text-xs font-medium text-white/50">SVG, PNG, JPG or GIF (max. 10MB)</p>
                    </div>
                    <Button
                        variant="outline"
                        className="relative w-full max-w-[200px] bg-white/5 backdrop-blur-md border-white/10 text-white hover:border-violet-500/50 hover:bg-violet-500 hover:text-white transition-all duration-300 rounded-xl shadow-sm z-10"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {fileName ? "Change File" : "Select File"}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setFileName(e.target.files[0].name)
                            }
                        }}
                    />
                </div>
            )
        case "image":
            return (
                <div className="relative overflow-hidden border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white/5 to-transparent gap-4 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-500 group/image cursor-pointer">
                    <div className="absolute inset-0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                    <div className="relative p-5 bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg shadow-violet-500/10 group-hover/image:scale-110 group-hover/image:shadow-violet-500/20 transition-all duration-500 ring-1 ring-white/10 group-hover/image:ring-violet-500/30">
                        <CloudUpload className="h-7 w-7 text-violet-400" />
                    </div>
                    <div className="relative space-y-1.5 z-10">
                        <p className="text-sm font-bold text-white group-hover/image:text-violet-300 transition-colors duration-300">{imageName || "Click to Upload Image"}</p>
                        <p className="text-xs font-medium text-white/50">High resolution recommended</p>
                    </div>
                    <Button
                        className="relative w-full max-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 rounded-xl z-10"
                        size="sm"
                        onClick={() => imageInputRef.current?.click()}
                    >
                        {imageName ? "Change Image" : "Select Image"}
                    </Button>
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setImageName(e.target.files[0].name)
                            }
                        }}
                    />
                </div>
            )
        case "currency":
            return (
                <div className="relative group/currency">
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-hover/currency:text-primary transition-colors" />
                    <Input
                        type="number"
                        {...commonProps}
                        className={cn(commonProps.className, "pl-10 text-right font-mono")}
                        placeholder="0.00"
                        min={0}
                        step={0.01}
                        value={currencyValue}
                        onChange={(e) => setCurrencyValue(e.target.value)}
                        onBlur={(e) => {
                            const val = parseFloat(e.target.value)
                            if (!isNaN(val)) {
                                setCurrencyValue(val.toFixed(2))
                            }
                        }}
                    />
                </div>
            )
        case "percent":
            return (
                <div className="relative group/percent">
                    <Input
                        type="number"
                        {...commonProps}
                        className={cn(commonProps.className, "pr-10 text-right font-mono", !isPercentValid ? "border-destructive focus-visible:ring-destructive bg-destructive/5" : "")}
                        placeholder="0"
                        min={0}
                        max={100}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value)
                            if (val > 100 || val < 0) {
                                setIsPercentValid(false)
                            } else {
                                setIsPercentValid(true)
                            }
                        }}
                    />
                    <Percent className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground group-hover/percent:text-primary transition-colors" />
                </div>
            )
        case "rating":
            return (
                <div className="flex gap-2 p-2.5 bg-muted/5 rounded-full w-fit border border-transparent hover:border-muted/20 transition-all duration-300">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRatingValue(star)}
                            className="focus:outline-none group/star transform transition-transform active:scale-95"
                        >
                            <Star
                                className={`w-8 h-8 cursor-pointer transition-all duration-300 ${star <= ratingValue
                                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.25)]"
                                    : "text-muted-foreground/20 hover:text-amber-400/50 hover:scale-110"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            )
        case "slider":
        case "range":
            return (
                <div className="space-y-5 pt-4 px-1">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Price range</Label>
                        <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                            {sliderMin} - {sliderMax}
                        </span>
                    </div>

                    <div className="relative h-6 flex items-center group/slider">
                        {/* Track Background */}
                        <div className="absolute w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden shadow-inner">
                            <div className="w-full h-full bg-muted/20" />
                        </div>

                        {/* Active Track */}
                        <div
                            className="absolute h-1.5 bg-gradient-to-r from-primary/80 to-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]"
                            style={{
                                left: `${sliderMin}%`,
                                width: `${sliderMax - sliderMin}%`
                            }}
                        />

                        {/* Range Input: Min */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderMin}
                            onChange={(e) => {
                                const val = Math.min(parseInt(e.target.value), sliderMax - 1)
                                setSliderMin(val)
                            }}
                            className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 z-20"
                        />

                        {/* Range Input: Max */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderMax}
                            onChange={(e) => {
                                const val = Math.max(parseInt(e.target.value), sliderMin + 1)
                                setSliderMax(val)
                            }}
                            className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 z-30"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Input
                            type="number"
                            className="h-9 transition-all focus:ring-1 focus:ring-primary/20 text-center font-mono"
                            min={0}
                            max={sliderMax - 1}
                            value={sliderMin}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 0
                                if (val < sliderMax) setSliderMin(val)
                            }}
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            type="number"
                            className="h-9"
                            min={sliderMin + 1}
                            max={100}
                            value={sliderMax}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 100
                                if (val > sliderMin) setSliderMax(val)
                            }}
                        />
                    </div>
                </div>
            )
        case "country":
            return (
                <div>
                    <Input list="country-list" placeholder={placeholder || "Select or type country..."} />
                    <datalist id="country-list">
                        {COUNTRIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                </div>
            )
        case "city":
            const cityCountryData = LOCATION_DATA[addressCountry]
            const cityStates = cityCountryData?.states || []
            const cityCities = cityCountryData?.cities[addressState] || []

            return (
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Country</Label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={addressCountry}
                            onChange={(e) => {
                                setAddressCountry(e.target.value)
                                setAddressState("")
                                setAddressCity("")
                            }}
                        >
                            <option value="">Select Country</option>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">State / Province</Label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={addressState}
                            disabled={!addressCountry}
                            onChange={(e) => {
                                setAddressState(e.target.value)
                                setAddressCity("")
                            }}
                        >
                            <option value="">Select State</option>
                            {cityStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">City</Label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={addressCity}
                            disabled={!addressState}
                            onChange={(e) => setAddressCity(e.target.value)}
                        >
                            <option value="">Select City</option>
                            {cityCities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            )
        case "zip":
            return <Input
                {...commonProps}
                placeholder={placeholder || "Zip / Postal Code"}
                value={zipValue}
                maxLength={6}
                onChange={(e) => setZipValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
        case "address":
            // Address specific state (derived from shared state for preview simplicity, or use new state vars if multiple needed)
            // Ideally we should have separate state for address, but for preview we can reuse or create local vars inside the component?
            // No, we must use the hooks at the top.
            // Let's use the 'multiSelected' or 'options' prop? No.
            // We need new state variables for Address dependencies.
            // Since we can't easily add hooks inside the switch, we assume they are added at top level.
            // See next tool call for adding hooks.

            const currentCountryData = LOCATION_DATA[addressCountry]
            const currentStates = currentCountryData?.states || []
            const currentCityData = currentCountryData?.cities[addressState] || []

            return (
                <div className="space-y-2">
                    <Input placeholder="Street Address" />
                    <Input placeholder="Apartment, Suite, etc. (optional)" />
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Input
                                list="address-state-list"
                                placeholder="State / Province"
                                value={addressState}
                                onChange={(e) => {
                                    setAddressState(e.target.value)
                                    setAddressCity("") // Reset city on state change
                                }}
                            />
                            <datalist id="address-state-list">
                                {currentStates.map(s => <option key={s} value={s} />)}
                            </datalist>
                        </div>
                        <div>
                            <Input
                                list="address-city-list"
                                placeholder="City"
                                value={addressCity}
                                onChange={(e) => setAddressCity(e.target.value)}
                            />
                            <datalist id="address-city-list">
                                {currentCityData.map(c => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Zip / Postal Code"
                            value={zipValue}
                            maxLength={6}
                            onChange={(e) => setZipValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        />
                        <div>
                            <Input
                                list="address-country-list"
                                placeholder="Country"
                                value={addressCountry}
                                onChange={(e) => {
                                    setAddressCountry(e.target.value)
                                    setAddressState("") // Reset state
                                    setAddressCity("") // Reset city
                                }}
                            />
                            <datalist id="address-country-list">
                                {COUNTRIES.map(c => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                    </div>
                </div>
            )
        case "payment":
            return (
                <div className="space-y-2 border rounded-md p-4 bg-muted/20">
                    <div className="relative">
                        <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Card Number"
                            className={`pl-9 ${!isCardValid ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            value={cardValue}
                            maxLength={16}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                                setCardValue(val)
                                setIsCardValid(val.length === 16 || val.length === 0)
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="MM / YY"
                            value={expiryValue}
                            maxLength={5}
                            onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '').slice(0, 4)
                                if (val.length >= 2) {
                                    val = val.slice(0, 2) + '/' + val.slice(2)
                                }
                                setExpiryValue(val)
                            }}
                        />
                        <Input
                            placeholder="CVC"
                            value={cvcValue}
                            maxLength={3}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 3)
                                setCvcValue(val)
                            }}
                        />
                    </div>
                    {!isCardValid && <span className="text-[0.8rem] text-destructive font-medium">Card number must be 16 digits</span>}
                </div>
            )
        default:
            return <Input {...commonProps} />
    }
}
