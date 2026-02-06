import * as React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Star, DollarSign, Percent, CreditCard, ChevronDown, CloudUpload, Search, X, Eye, EyeOff, Calendar } from "lucide-react"
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
// Theme Definitions for different field categories
// Theme Definitions for different field categories (Light Mode Glassmorphism)
const getFieldTheme = (type: string) => {
    switch (type) {
        case "text":
            return {
                card: "bg-blue-50/50 border-blue-400 hover:border-blue-500 shadow-sm hover:shadow-blue-500/10",
                active: "border-blue-400 ring-4 ring-blue-500/10 shadow-blue-500/20 bg-blue-50",
                hover: "hover:bg-blue-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-blue-100 text-blue-600",
                glow: "from-blue-400/20 to-cyan-400/20",
                text: "text-blue-900",
                muted: "text-blue-700/60"
            }
        case "textarea":
            return {
                card: "bg-slate-50/50 border-slate-400 hover:border-slate-500 shadow-sm hover:shadow-slate-500/10",
                active: "border-slate-400 ring-4 ring-slate-500/10 shadow-slate-500/20 bg-slate-50",
                hover: "hover:bg-slate-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-slate-100 text-slate-600",
                glow: "from-slate-400/20 to-gray-400/20",
                text: "text-slate-900",
                muted: "text-slate-700/60"
            }
        case "email":
            return {
                card: "bg-indigo-50/50 border-indigo-400 hover:border-indigo-500 shadow-sm hover:shadow-indigo-500/10",
                active: "border-indigo-400 ring-4 ring-indigo-500/10 shadow-indigo-500/20 bg-indigo-50",
                hover: "hover:bg-indigo-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-indigo-100 text-indigo-600",
                glow: "from-indigo-400/20 to-violet-400/20",
                text: "text-indigo-900",
                muted: "text-indigo-700/60"
            }
        case "phone":
            return {
                card: "bg-cyan-50/50 border-cyan-400 hover:border-cyan-500 shadow-sm hover:shadow-cyan-500/10",
                active: "border-cyan-400 ring-4 ring-cyan-500/10 shadow-cyan-500/20 bg-cyan-50",
                hover: "hover:bg-cyan-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-cyan-100 text-cyan-600",
                glow: "from-cyan-400/20 to-teal-400/20",
                text: "text-cyan-900",
                muted: "text-cyan-700/60"
            }
        case "url":
            return {
                card: "bg-sky-50/50 border-sky-400 hover:border-sky-500 shadow-sm hover:shadow-sky-500/10",
                active: "border-sky-400 ring-4 ring-sky-500/10 shadow-sky-500/20 bg-sky-50",
                hover: "hover:bg-sky-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-sky-100 text-sky-600",
                glow: "from-sky-400/20 to-blue-400/20",
                text: "text-sky-900",
                muted: "text-sky-700/60"
            }
        case "password":
            return {
                card: "bg-red-50/50 border-red-400 hover:border-red-500 shadow-sm hover:shadow-red-500/10",
                active: "border-red-400 ring-4 ring-red-500/10 shadow-red-500/20 bg-red-50",
                hover: "hover:bg-red-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-red-100 text-red-600",
                glow: "from-red-400/20 to-rose-400/20",
                text: "text-red-900",
                muted: "text-red-700/60"
            }
        case "number":
            return {
                card: "bg-lime-50/50 border-lime-400 hover:border-lime-500 shadow-sm hover:shadow-lime-500/10",
                active: "border-lime-400 ring-4 ring-lime-500/10 shadow-lime-500/20 bg-lime-50",
                hover: "hover:bg-lime-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-lime-100 text-lime-600",
                glow: "from-lime-400/20 to-green-400/20",
                text: "text-lime-900",
                muted: "text-lime-700/60"
            }
        case "file":
            return {
                card: "bg-violet-50/50 border-violet-400 hover:border-violet-500 shadow-sm hover:shadow-violet-500/10",
                active: "border-violet-400 ring-4 ring-violet-500/10 shadow-violet-500/20 bg-violet-50",
                hover: "hover:bg-violet-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-violet-100 text-violet-600",
                glow: "from-violet-400/20 to-purple-400/20",
                text: "text-violet-900",
                muted: "text-violet-700/60"
            }
        case "image":
            return {
                card: "bg-fuchsia-50/50 border-fuchsia-400 hover:border-fuchsia-500 shadow-sm hover:shadow-fuchsia-500/10",
                active: "border-fuchsia-400 ring-4 ring-fuchsia-500/10 shadow-fuchsia-500/20 bg-fuchsia-50",
                hover: "hover:bg-fuchsia-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-fuchsia-100 text-fuchsia-600",
                glow: "from-fuchsia-400/20 to-pink-400/20",
                text: "text-fuchsia-900",
                muted: "text-fuchsia-700/60"
            }
        case "date":
            return {
                card: "bg-rose-50/50 border-rose-400 hover:border-rose-500 shadow-sm hover:shadow-rose-500/10",
                active: "border-rose-400 ring-4 ring-rose-500/10 shadow-rose-500/20 bg-rose-50",
                hover: "hover:bg-rose-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-rose-100 text-rose-600",
                glow: "from-rose-400/20 to-red-400/20",
                text: "text-rose-900",
                muted: "text-rose-700/60"
            }
        case "time":
            return {
                card: "bg-amber-50/50 border-amber-400 hover:border-amber-500 shadow-sm hover:shadow-amber-500/10",
                active: "border-amber-400 ring-4 ring-amber-500/10 shadow-amber-500/20 bg-amber-50",
                hover: "hover:bg-amber-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-amber-100 text-amber-600",
                glow: "from-amber-400/20 to-orange-400/20",
                text: "text-amber-900",
                muted: "text-amber-700/60"
            }
        case "datetime":
            return {
                card: "bg-orange-50/50 border-orange-400 hover:border-orange-500 shadow-sm hover:shadow-orange-500/10",
                active: "border-orange-400 ring-4 ring-orange-500/10 shadow-orange-500/20 bg-orange-50",
                hover: "hover:bg-orange-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-orange-100 text-orange-600",
                glow: "from-orange-400/20 to-red-400/20",
                text: "text-orange-900",
                muted: "text-orange-700/60"
            }
        case "multi-select":
            return {
                card: "bg-emerald-50/50 border-emerald-400 hover:border-emerald-500 shadow-sm hover:shadow-emerald-500/10",
                active: "border-emerald-400 ring-4 ring-emerald-500/10 shadow-emerald-500/20 bg-emerald-50",
                hover: "hover:bg-emerald-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-emerald-100 text-emerald-600",
                glow: "from-emerald-400/20 to-green-400/20",
                text: "text-emerald-900",
                muted: "text-emerald-700/60"
            }
        case "dropdown":
            return {
                card: "bg-teal-50/50 border-teal-400 hover:border-teal-500 shadow-sm hover:shadow-teal-500/10",
                active: "border-teal-400 ring-4 ring-teal-500/10 shadow-teal-500/20 bg-teal-50",
                hover: "hover:bg-teal-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-teal-100 text-teal-600",
                glow: "from-teal-400/20 to-cyan-400/20",
                text: "text-teal-900",
                muted: "text-teal-700/60"
            }
        case "checkbox-group":
            return {
                card: "bg-green-50/50 border-green-400 hover:border-green-500 shadow-sm hover:shadow-green-500/10",
                active: "border-green-400 ring-4 ring-green-500/10 shadow-green-500/20 bg-green-50",
                hover: "hover:bg-green-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-green-100 text-green-600",
                glow: "from-green-400/20 to-emerald-400/20",
                text: "text-green-900",
                muted: "text-green-700/60"
            }
        case "radio":
            return {
                card: "bg-yellow-50/50 border-yellow-400 hover:border-yellow-500 shadow-sm hover:shadow-yellow-500/10",
                active: "border-yellow-400 ring-4 ring-yellow-500/10 shadow-yellow-500/20 bg-yellow-50",
                hover: "hover:bg-yellow-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-yellow-100 text-yellow-600",
                glow: "from-yellow-400/20 to-amber-400/20",
                text: "text-yellow-900",
                muted: "text-yellow-700/60"
            }
        case "slider":
        case "range":
            return {
                card: "bg-pink-50/50 border-pink-400 hover:border-pink-500 shadow-sm hover:shadow-pink-500/10",
                active: "border-pink-400 ring-4 ring-pink-500/10 shadow-pink-500/20 bg-pink-50",
                hover: "hover:bg-pink-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-pink-100 text-pink-600",
                glow: "from-pink-400/20 to-rose-400/20",
                text: "text-pink-900",
                muted: "text-pink-700/60"
            }
        case "rating":
            return {
                card: "bg-yellow-50/50 border-yellow-400 hover:border-yellow-500 shadow-sm hover:shadow-yellow-500/10",
                active: "border-yellow-400 ring-4 ring-yellow-500/10 shadow-yellow-500/20 bg-yellow-50",
                hover: "hover:bg-yellow-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-yellow-100 text-yellow-600",
                glow: "from-yellow-400/20 to-gold-400/20",
                text: "text-yellow-900",
                muted: "text-yellow-700/60"
            }
        case "switch":
        case "checkbox":
            return {
                card: "bg-purple-50/50 border-purple-400 hover:border-purple-500 shadow-sm hover:shadow-purple-500/10",
                active: "border-purple-400 ring-4 ring-purple-500/10 shadow-purple-500/20 bg-purple-50",
                hover: "hover:bg-purple-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-purple-100 text-purple-600",
                glow: "from-purple-400/20 to-fuchsia-400/20",
                text: "text-purple-900",
                muted: "text-purple-700/60"
            }
        default:
            return {
                card: "bg-gray-50/50 border-gray-400 hover:border-gray-500 shadow-sm hover:shadow-gray-500/10",
                active: "border-gray-400 ring-4 ring-gray-500/10 shadow-gray-500/20 bg-white",
                hover: "hover:bg-gray-50/80 hover:scale-[1.01] hover:shadow-md",
                icon: "bg-gray-100 text-gray-600",
                glow: "from-gray-200 to-slate-200",
                text: "text-gray-900",
                muted: "text-gray-500"
            }
    }
}

export function FieldPreview({ field, onRemove, selected, onSelect }: FieldPreviewProps) {
    const theme = getFieldTheme(field.type)

    return (
        <Card
            className={cn(
                "p-6 group relative border rounded-3xl cursor-pointer transition-all duration-500 ease-out backdrop-blur-xl animate-fade-slide-up",
                theme.card,
                // Specific Theme Styles
                selected
                    ? cn("z-10 scale-[1.02] -translate-y-0.5 shadow-xl shadow-primary/5", theme.active)
                    : cn("bg-opacity-80", theme.hover)
            )}
            onClick={(e) => {
                e.stopPropagation()
                onSelect?.(field.id)
            }}
        >
            {/* Active Gradient Border & Glow - using pseudo-element technique for performance */}
            {selected && (
                <>
                    <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent [background:linear-gradient(var(--card),var(--card))_padding-box,linear-gradient(135deg,theme(colors.indigo.500),theme(colors.purple.500),theme(colors.pink.500))_border-box] [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:destination-out] mask-composite:exclude opacity-50 animate-glow-pulse" />
                    {/* Left Accent Bar */}
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-transparent via-primary to-transparent rounded-r-full animate-slide-in-left shadow-[2px_0_8px_rgba(var(--color-primary),0.4)]" />
                </>
            )}

            {/* Soft Gradient Glow */}
            <div className={cn("absolute -top-[50%] -right-[50%] w-[150%] h-[150%] rounded-full bg-gradient-to-br blur-3xl opacity-30 pointer-events-none transition-all duration-1000", theme.glow, selected ? "opacity-60 rotate-180 scale-110" : "group-hover:opacity-50")} />

            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 rounded-xl shadow-sm hover:shadow-md hover:scale-105",
                    "bg-white/50 hover:bg-white text-gray-500 hover:text-red-500"
                )}
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove?.(field.id)
                }}
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <div className={cn("relative space-y-4 z-10 p-1 transition-transform duration-300", selected ? "translate-x-1" : "")}>
                <div className="flex items-center gap-2 mb-2">
                    <Label className={cn("text-base font-semibold tracking-tight transition-colors", theme.text)}>{field.label}</Label>
                    {field.required && <span className="text-red-500 font-bold text-lg leading-3">*</span>}
                </div>
                {/* Render Field Input Component */}
                <FieldInput field={field} theme={theme} />
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

// Modern Floating Label Input Wrapper
const ModernInput = ({ label, children, active }: { label?: string, children: React.ReactNode, active?: boolean }) => (
    <div className="relative group/input pt-1">
        {children}
        {label && (
            <label className={cn(
                "absolute left-3 top-0 text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-white/80 px-1 rounded-sm transition-all duration-300 pointer-events-none",
                active ? "text-primary -translate-y-1/2 scale-105" : "group-hover/input:text-gray-500 opacity-0 group-focus-within/input:opacity-100 group-focus-within/input:-translate-y-1/2 group-focus-within/input:text-primary"
            )}>
                {label}
            </label>
        )}
    </div>
)

const FieldInput = ({ field, theme }: { field: CanvasField, theme: any }) => {
    const { type, placeholder, options } = field

    // Updated Modern Input Props
    // Updated Modern Input Props
    // Dynamic Field Styling
    const getFieldTheme = (t: string) => {
        switch (t) {
            case "currency": return "bg-green-50/60 border-green-300 hover:border-green-400 focus:border-green-500 focus:ring-green-500/20"
            case "percent": return "bg-yellow-50/60 border-yellow-300 hover:border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500/20"
            case "country": return "bg-blue-50/60 border-blue-300 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500/20"
            case "city":
            case "state": return "bg-indigo-50/60 border-indigo-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-indigo-500/20"
            case "zip": return "bg-purple-50/60 border-purple-300 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500/20"
            case "address": return "bg-pink-50/60 border-pink-300 hover:border-pink-400 focus:border-pink-500 focus:ring-pink-500/20"
            case "payment": return "bg-rose-50/60 border-rose-300 hover:border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
            case "date":
            case "time":
            case "datetime":
            case "datetime-local": return "bg-amber-50/60 border-amber-300 hover:border-amber-400 focus:border-amber-500 focus:ring-amber-500/20"
            default: return "bg-white/90 border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-primary/10"
        }
    }

    const fieldThemeClass = getFieldTheme(type)

    const commonProps = {
        placeholder: placeholder || `Enter ${type}...`,
        className: cn(
            "h-12 text-gray-900 placeholder:text-gray-400 rounded-xl transition-all duration-300 shadow-sm backdrop-blur-sm border",
            fieldThemeClass,
            "hover:shadow-md hover:bg-white/80",
            "focus:bg-white focus:ring-4 focus:shadow-md focus:scale-[1.01]",
            theme.text
        )
    }

    const [emailValue, setEmailValue] = React.useState("")
    const [emailError, setEmailError] = React.useState<string | null>(null)

    const [phoneValue, setPhoneValue] = React.useState("")
    const [phoneError, setPhoneError] = React.useState<string | null>(null)

    const [showPassword, setShowPassword] = React.useState(false)
    const [passwordError, setPasswordError] = React.useState<string | null>(null)

    const [urlValue, setUrlValue] = React.useState("")
    const [urlError, setUrlError] = React.useState<string | null>(null)

    const [passwordValue, setPasswordValue] = React.useState("")

    const [isMultiSelectOpen, setIsMultiSelectOpen] = React.useState(false)
    const [multiSelected, setMultiSelected] = React.useState<string[]>([])

    // Selection States
    const [checkboxSelected, setCheckboxSelected] = React.useState<string[]>([])
    const [radioSelected, setRadioSelected] = React.useState<string>("")
    const [dropdownSelected, setDropdownSelected] = React.useState<string>("")

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
    const [percentValue, setPercentValue] = React.useState("") // Strict controlled state
    const [currencyValue, setCurrencyValue] = React.useState("")
    const [ratingValue, setRatingValue] = React.useState(0)
    const [sliderMin, setSliderMin] = React.useState(0)
    const [sliderMax, setSliderMax] = React.useState(100)

    // File Upload Refs & State
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const imageInputRef = React.useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = React.useState("")
    const [imageName, setImageName] = React.useState("")

    // Custom Time Picker State
    const [timeHour, setTimeHour] = React.useState("12")
    const [timeMinute, setTimeMinute] = React.useState("00")
    const [timePeriod, setTimePeriod] = React.useState("AM")

    switch (type) {
        case "text":
            return (
                <ModernInput label={type} active={!!field.placeholder}>
                    <Input {...commonProps} />
                </ModernInput>
            )
        case "textarea":
            return (
                <ModernInput label={type} active={!!field.placeholder}>
                    <Textarea {...commonProps} className={cn(commonProps.className, "min-h-[80px] resize-y")} />
                </ModernInput>
            )
        case "email":
            return (
                <ModernInput label="Email" active={!!emailValue}>
                    <Input
                        {...commonProps}
                        type="text"
                        value={emailValue}
                        className={cn(
                            commonProps.className,
                            emailError ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500/50 bg-red-50/10" : ""
                        )}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\s/g, "")
                            setEmailValue(val)

                            // Strict Gmail Validation
                            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/

                            if (!gmailRegex.test(val)) {
                                setEmailError("Email must be a valid @gmail.com address")
                            } else {
                                setEmailError(null)
                            }
                        }}
                        onBlur={() => {
                            if (!emailValue.endsWith("@gmail.com")) {
                                setEmailError("Email must be a valid @gmail.com address")
                            }
                        }}
                    />
                    {emailError && (
                        <p className="text-xs text-red-500 mt-1 font-medium ml-1">
                            {emailError}
                        </p>
                    )}
                </ModernInput>
            )


        case "phone":
            return (
                <ModernInput label="Phone" active={!!phoneValue}>
                    <Input
                        type="tel"
                        {...commonProps}
                        value={phoneValue}
                        maxLength={10}
                        inputMode="numeric"
                        className={cn(
                            commonProps.className,
                            phoneError ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500/50 bg-red-50/10" : ""
                        )}
                        onChange={(e) => {
                            const numeric = e.target.value.replace(/\D/g, "")
                            const limited = numeric.slice(0, 10)
                            setPhoneValue(limited)

                            // Clear error if valid, but don't error regular typing
                            if (phoneError && limited.length === 10) {
                                setPhoneError(null)
                            }
                        }}
                        onBlur={() => {
                            if (phoneValue.length > 0 && phoneValue.length !== 10) {
                                setPhoneError("Please enter a valid 10-digit phone number")
                            }
                        }}
                    />
                    {phoneError && (
                        <p className="text-xs text-red-500 mt-1 font-medium ml-1">
                            {phoneError}
                        </p>
                    )}
                </ModernInput>
            )

        case "password":
            return (
                <ModernInput label="Password" active={!!passwordValue}>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            {...commonProps}
                            value={passwordValue}
                            className={cn(
                                commonProps.className,
                                passwordError ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500/50 bg-red-50/10" : "",
                                "pr-10"
                            )}
                            onChange={(e) => {
                                const val = e.target.value
                                setPasswordValue(val)

                                const strongRegex =
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

                                if (!strongRegex.test(val)) {
                                    setPasswordError(
                                        "Min 8 chars, 1 upper, 1 lower, 1 number, 1 special char"
                                    )
                                } else {
                                    setPasswordError(null)
                                }
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {passwordError && (
                        <p className="text-xs text-red-500 mt-1 font-medium ml-1">
                            {passwordError}
                        </p>
                    )}
                </ModernInput>
            )

        case "url":
            return (
                <ModernInput label="Website" active={!!urlValue}>
                    <Input
                        type="url"
                        {...commonProps}
                        value={urlValue}
                        placeholder="https://example.com"
                        className={cn(
                            commonProps.className,
                            urlError ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500/50 bg-red-50/10" : ""
                        )}
                        onChange={(e) => {
                            const val = e.target.value
                            setUrlValue(val)

                            const urlRegex =
                                /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/.*)?$/

                            if (!urlRegex.test(val)) {
                                setUrlError("URL must start with http:// or https://")
                            } else {
                                setUrlError(null)
                            }
                        }}
                    />
                    {urlError && (
                        <p className="text-xs text-red-500 mt-1 font-medium ml-1">
                            {urlError}
                        </p>
                    )}
                </ModernInput>
            )

        case "number":
            return (
                <ModernInput label="Number" active={!!field.placeholder}>
                    <Input
                        type="number"
                        {...commonProps}
                        onKeyDown={(e) => {
                            if (["e", "E", "+", "-"].includes(e.key)) {
                                e.preventDefault()
                            }
                        }}
                    />
                </ModernInput>
            )
        case "date":
            return (
                <ModernInput label="Date" active={true}>
                    <Input type="date" {...commonProps} />
                </ModernInput>
            )
        case "time":
            return (
                <div className="flex items-center gap-2 p-1.5 border border-gray-200 rounded-xl bg-white/40 group/time hover:border-gray-300 transition-colors cursor-text">
                    <Input
                        type="number"
                        placeholder="12"
                        className={cn("w-14 text-center h-9 bg-transparent border-transparent focus:border-gray-300 hover:bg-white/40 shadow-none font-mono placeholder:text-gray-400", theme.text)}
                        min={1}
                        max={12}
                        onChange={(e) => {
                            if (parseInt(e.target.value) > 12) e.target.value = "12"
                        }}
                    />
                    <span className="font-bold text-gray-400 animate-pulse">:</span>
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
                    <div className="flex items-center gap-2 p-1.5 border border-gray-200 rounded-xl bg-white/40 group/time hover:border-gray-300 transition-colors">
                        <Input
                            type="number"
                            placeholder="12"
                            className={cn("w-14 text-center h-9 bg-transparent border-transparent focus:border-gray-300 hover:bg-white/40 shadow-none font-mono placeholder:text-gray-400", theme.text)}
                            min={1}
                            max={12}
                            onChange={(e) => {
                                if (parseInt(e.target.value) > 12) e.target.value = "12"
                            }}
                        />
                        <span className="font-bold text-gray-400 animate-pulse">:</span>
                        <Input
                            type="number"
                            placeholder="00"
                            className={cn("w-14 text-center h-9 bg-transparent border-transparent focus:border-gray-300 hover:bg-white/40 shadow-none font-mono placeholder:text-gray-400", theme.text)}
                            min={0}
                            max={59}
                            onChange={(e) => {
                                if (parseInt(e.target.value) > 59) e.target.value = "59"
                            }}
                        />
                        <select className={cn("h-9 w-18 rounded-lg border border-gray-200 bg-white/50 px-2 text-sm focus:ring-2 focus:ring-black/5 cursor-pointer hover:bg-white/80", theme.text)}>
                            <option>AM</option>
                            <option>PM</option>
                        </select>
                    </div>
                </div>
            )
        case "switch":
            return (
                <div className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-xl bg-white/40 hover:bg-white/60 hover:border-gray-300 hover:shadow-sm transition-all duration-300 cursor-pointer group/switch">
                    <Switch id="switch-preview" className="data-[state=checked]:bg-orange-500 ring-offset-slate-950" />
                    <Label htmlFor="switch-preview" className={cn("text-sm font-medium cursor-pointer flex-1", theme.text)}>Toggle Option</Label>
                </div>
            )
        case "checkbox":
            const cbOptions = options && options.length > 0 ? options : ["Option 1", "Option 2", "Option 3"]
            return (
                <div className="space-y-2">
                    {cbOptions.map((opt, i) => {
                        const isSelected = checkboxSelected.includes(opt)
                        return (
                            <div key={i} className="flex items-center gap-2">
                                <Checkbox
                                    id={`cb-${field.id}-${i}`}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setCheckboxSelected([...checkboxSelected, opt])
                                        } else {
                                            setCheckboxSelected(checkboxSelected.filter(o => o !== opt))
                                        }
                                    }}
                                />
                                <Label htmlFor={`cb-${field.id}-${i}`} className="text-sm font-normal cursor-pointer select-none">{opt}</Label>
                            </div>
                        )
                    })}
                </div>
            )
        case "checkbox-group":
            // Reuse checkbox logic for checkbox-group if distinct, else map to similar
            const cgOptions = options && options.length > 0 ? options : ["Option 1", "Option 2", "Option 3"]
            return (
                <div className="space-y-2">
                    {cgOptions.map((opt, i) => {
                        const isSelected = checkboxSelected.includes(opt)
                        return (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:bg-white/40 hover:border-gray-200 transition-all duration-200 cursor-pointer">
                                <Checkbox
                                    id={`cb-group-${field.id}-${i}`}
                                    className={cn("data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground rounded-[4px] border-gray-400")}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setCheckboxSelected([...checkboxSelected, opt])
                                        } else {
                                            setCheckboxSelected(checkboxSelected.filter(o => o !== opt))
                                        }
                                    }}
                                />
                                <Label htmlFor={`cb-group-${field.id}-${i}`} className={cn("text-sm font-medium cursor-pointer flex-1 select-none", theme.text)}>{opt}</Label>
                            </div>
                        )
                    })}
                </div>
            )
        case "radio":
            const radioOptions = options && options.length > 0 ? options : ["Option 1", "Option 2"]
            return (
                <div className="space-y-3">
                    {radioOptions.map((opt, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-transparent bg-white/40 hover:bg-white/60 hover:border-primary/20 hover:shadow-sm transition-all duration-200 cursor-pointer group/radio"
                            onClick={() => setRadioSelected(opt)}>
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name={`radio-${field.id}`}
                                    id={`radio-${field.id}-${i}`}
                                    className="peer h-5 w-5 border-2 border-gray-400 text-primary focus:ring-offset-0 focus:ring-0 checked:border-primary checked:bg-primary transition-all cursor-pointer appearance-none rounded-full"
                                    checked={radioSelected === opt}
                                    onChange={() => setRadioSelected(opt)}
                                />
                                <div className="absolute h-2.5 w-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                            <Label htmlFor={`radio-${field.id}-${i}`} className={cn("text-sm font-medium cursor-pointer flex-1 text-gray-700", theme.text)}>{opt}</Label>
                        </div>
                    ))}
                </div>
            )
        case "dropdown":
            const ddOptions = options && options.length > 0 ? options : ["Option 1", "Option 2", "Option 3"]
            return (
                <div className="relative group/dropdown">
                    <select
                        className={cn("w-full h-12 px-3 pr-8 rounded-xl border border-gray-200 bg-white/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm appearance-none cursor-pointer hover:border-gray-300", theme.text)}
                        value={dropdownSelected}
                        onChange={(e) => setDropdownSelected(e.target.value)}
                    >
                        <option value="" disabled>Select an option...</option>
                        {ddOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-500 pointer-events-none group-hover/dropdown:text-gray-700 transition-colors" />
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
                        className={cn("flex flex-wrap items-center gap-2 w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-gray-200 bg-white/40 backdrop-blur-sm text-sm cursor-pointer hover:border-gray-300 hover:bg-white/60 hover:shadow-sm transition-all duration-300", theme.text)}
                        onClick={() => setIsMultiSelectOpen(!isMultiSelectOpen)}
                    >
                        {multiSelected.length > 0 ? (
                            multiSelected.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-3 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow-sm animate-in zoom-in-75 duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setMultiSelected(prev => prev.filter(p => p !== item))
                                    }}
                                >
                                    {item}
                                    <div className="bg-black/5 rounded-full p-0.5 hover:bg-black/10 hover:text-red-500 transition-colors cursor-pointer">
                                        <X className="h-2.5 w-2.5" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-400 italic px-1">{placeholder || "Select options..."}</span>
                        )}
                        <ChevronDown className={`ml-auto h-4 w-4 text-gray-400 transition-transform duration-500 ease-spring ${isMultiSelectOpen ? 'rotate-180 text-gray-600 scale-110' : ''}`} />
                    </div>

                    {isMultiSelectOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 border border-gray-100 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl shadow-black/5 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 overflow-hidden ring-1 ring-black/5">
                            <div className="flex items-center border-b border-gray-100 px-3 py-2.5 bg-white/50">
                                <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
                                <input
                                    className="flex h-9 w-full rounded-lg bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Type to filter..."
                                    value={searchQuery}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                                {filteredOptions.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 text-gray-200" />
                                        <p>No matches found</p>
                                    </div>
                                ) : (
                                    filteredOptions.map((opt, i) => {
                                        const isSelected = multiSelected.includes(opt)
                                        return (
                                            <div
                                                key={i}
                                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? "bg-primary/10 text-primary font-medium border border-primary/20" : "hover:bg-gray-50 hover:translate-x-1 text-gray-600"}`}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (isSelected) {
                                                        setMultiSelected(prev => prev.filter(p => p !== opt))
                                                    } else {
                                                        setMultiSelected(prev => [...prev, opt])
                                                    }
                                                }}
                                            >
                                                <Checkbox id={`ms-${i}`} checked={isSelected} className="rounded-md data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-gray-300" />
                                                <Label htmlFor={`ms-${i}`} className={`text-sm cursor-pointer flex-1 ${isSelected ? "text-primary" : "text-gray-600"}`}>{opt}</Label>
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
                <div className="relative overflow-hidden border border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white/40 to-transparent gap-4 hover:border-violet-500/50 hover:bg-violet-50/50 transition-all duration-500 group/file cursor-pointer">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-0 group-hover/file:opacity-100 transition-opacity duration-700 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                    <div className="relative p-5 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200 group-hover/file:scale-110 group-hover/file:shadow-violet-200 transition-all duration-500 ring-1 ring-gray-100 group-hover/file:ring-violet-200">
                        <CloudUpload className="h-7 w-7 text-gray-500 group-hover/file:text-violet-500 transition-colors duration-300" />
                    </div>
                    <div className="relative space-y-1.5 z-10">
                        <p className={cn("text-sm font-bold transition-colors duration-300 group-hover/file:text-violet-600", theme.text)}>{fileName || "Click to Upload File"}</p>
                        <p className="text-xs font-medium text-gray-500">SVG, PNG, JPG or GIF (max. 10MB)</p>
                    </div>
                    <Button
                        variant="outline"
                        className="relative w-full max-w-[200px] bg-white/60 backdrop-blur-md border-gray-200 text-gray-700 hover:border-violet-500/50 hover:bg-violet-500 hover:text-white transition-all duration-300 rounded-xl shadow-sm z-10"
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
                <div className="relative overflow-hidden border border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white/40 to-transparent gap-4 hover:border-violet-500/50 hover:bg-violet-50/50 transition-all duration-500 group/image cursor-pointer">
                    <div className="absolute inset-0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                    <div className="relative p-5 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200 group-hover/image:scale-110 group-hover/image:shadow-violet-200 transition-all duration-500 ring-1 ring-gray-100 group-hover/image:ring-violet-200">
                        <CloudUpload className="h-7 w-7 text-violet-500" />
                    </div>
                    <div className="relative space-y-1.5 z-10">
                        <p className={cn("text-sm font-bold transition-colors duration-300 group-hover/image:text-violet-600", theme.text)}>{imageName || "Click to Upload Image"}</p>
                        <p className="text-xs font-medium text-gray-500">High resolution recommended</p>
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
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-hover/currency:text-primary transition-colors" />
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
                        type="text"
                        value={percentValue}
                        placeholder="0"
                        className={cn(
                            commonProps.className,
                            "pr-10 text-right font-mono"
                        )}
                        onChange={(e) => {
                            let val = e.target.value

                            // Remove everything except digits
                            val = val.replace(/\D/g, "")

                            // Allow empty
                            if (val === "") {
                                setPercentValue("")
                                return
                            }

                            let num = parseInt(val, 10)

                            // Clamp between 0 and 100
                            if (num > 100) num = 100
                            if (num < 0) num = 0

                            setPercentValue(num.toString())
                        }}
                    />
                    <Percent className="absolute right-3 top-2.5 h-5 w-5 text-gray-600 pointer-events-none" />
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
                <div className="space-y-1">
                    <select
                        className={cn("flex h-10 w-full rounded-xl border border-gray-200 bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50", theme.text)}
                        defaultValue=""
                    >
                        <option value="" disabled>Select Country...</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
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
        case "time":
            return (
                <ModernInput label={type} active={!!field.placeholder}>
                    <div className="flex gap-2">
                        {/* Hour Select */}
                        <div className="relative w-full">
                            <select
                                className={cn(commonProps.className, "appearance-none w-full px-3 py-2 pr-8")}
                                value={timeHour}
                                onChange={(e) => setTimeHour(e.target.value)}
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                                    <option key={h} value={h < 10 ? `0${h}` : `${h}`}>{h < 10 ? `0${h}` : h}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>

                        <span className="flex items-center text-muted-foreground font-bold">:</span>

                        {/* Minute Select */}
                        <div className="relative w-full">
                            <select
                                className={cn(commonProps.className, "appearance-none w-full px-3 py-2 pr-8")}
                                value={timeMinute}
                                onChange={(e) => setTimeMinute(e.target.value)}
                            >
                                {Array.from({ length: 60 }, (_, i) => i).map(m => (
                                    <option key={m} value={m < 10 ? `0${m}` : `${m}`}>{m < 10 ? `0${m}` : m}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>

                        {/* Period Select */}
                        <div className="relative w-24">
                            <select
                                className={cn(commonProps.className, "appearance-none w-full px-3 py-2 pr-8 bg-muted/50 text-center font-bold")}
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(e.target.value)}
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </ModernInput>
            )
        case "datetime":
        case "datetime-local":
            return (
                <ModernInput label={type === "datetime-local" ? "Date & Time" : type} active={!!field.placeholder}>
                    <div className="flex flex-col gap-2">
                        {/* Date Component */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                type="date"
                                className={cn(commonProps.className, "pl-10")}
                                onChange={() => {
                                    // Handle date change
                                }}
                            />
                        </div>

                        {/* Time Component (Reused Logic) */}
                        <div className="flex gap-2">
                            <div className="relative w-full">
                                <select
                                    className={cn(commonProps.className, "appearance-none w-full px-3 py-2 pr-8 text-center")}
                                    value={timeHour}
                                    onChange={(e) => setTimeHour(e.target.value)}
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                                        <option key={h} value={h < 10 ? `0${h}` : `${h}`}>{h < 10 ? `0${h}` : h}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                            <span className="flex items-center text-muted-foreground font-bold">:</span>
                            <div className="relative w-full">
                                <select
                                    className={cn(commonProps.className, "appearance-none w-full px-3 py-2 pr-8 text-center")}
                                    value={timeMinute}
                                    onChange={(e) => setTimeMinute(e.target.value)}
                                >
                                    {Array.from({ length: 60 }, (_, i) => i).map(m => (
                                        <option key={m} value={m < 10 ? `0${m}` : `${m}`}>{m < 10 ? `0${m}` : m}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                            <div className="relative w-24">
                                <select
                                    className={cn(commonProps.className, "appearance-none w-full px-3 py-2 pr-8 bg-muted/50 text-center font-bold")}
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(e.target.value)}
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </ModernInput>
            )
        default:
            return <Input {...commonProps} />
    }
}
