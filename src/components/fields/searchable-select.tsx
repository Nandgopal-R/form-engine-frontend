import { useState, useEffect, useRef } from "react"
import { Check, X, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchableSelectProps {
    options: string[]
    value: any
    onChange: (value: any) => void
    placeholder?: string
    isMulti?: boolean
    disabled?: boolean
    error?: boolean
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Select options...",
    isMulti = false,
    disabled = false,
    error = false
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedValues = isMulti
        ? (Array.isArray(value) ? value : [])
        : (value ? [value] : [])

    const toggleOption = (opt: string) => {
        if (isMulti) {
            const newVal = selectedValues.includes(opt)
                ? selectedValues.filter(v => v !== opt)
                : [...selectedValues, opt]
            onChange(newVal)
        } else {
            onChange(opt)
            setIsOpen(false)
        }
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Selector Button */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn(
                    "min-h-[44px] w-full bg-white border border-[#E5E1D8] rounded-xl px-3 py-2 flex flex-wrap gap-1.5 items-center cursor-pointer transition-all hover:border-[#D0C9BA] focus-within:ring-2 focus-within:ring-[#D0C9BA]/30 focus-within:border-[#D0C9BA]",
                    error && "border-red-500",
                    isOpen && "border-[#D0C9BA] ring-2 ring-[#D0C9BA]/30",
                    disabled && "opacity-50 cursor-not-allowed bg-[#F9F8F6]"
                )}
            >
                {selectedValues.length > 0 ? (
                    selectedValues.map((val, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold animate-in zoom-in-95 duration-200",
                                isMulti ? "bg-[#F5F2EA] text-[#4A4538] border border-[#E5E1D8]" : "bg-transparent text-[#4A4538]"
                            )}
                        >
                            <span>{val}</span>
                            {isMulti && (
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleOption(val)
                                    }}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <span className="text-[#9A9486] text-sm">{placeholder}</span>
                )}
                <div className="ml-auto flex items-center gap-2 pl-2">
                    <ChevronDown className={cn("w-4 h-4 text-[#9A9486] transition-transform duration-300", isOpen && "rotate-180")} />
                </div>
            </div>

            {/* Dropdown List */}
            {isOpen && (
                <div className="absolute z-[110] mt-2 w-full bg-white border border-[#E5E1D8] rounded-2xl shadow-2xl shadow-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Search Input */}
                    <div className="p-2 border-b border-[#F5F2EA]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9486]" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-9 pr-3 py-2 bg-[#F9F8F6] text-sm rounded-xl border-none focus:ring-0 placeholder:text-[#BBB5A5]"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, i) => {
                                const isSelected = selectedValues.includes(opt)
                                return (
                                    <div
                                        key={i}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleOption(opt)
                                        }}
                                        className={cn(
                                            "group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                                            isSelected ? "bg-[#E89E45]/10 text-[#E89E45]" : "hover:bg-[#F5F2EA] text-[#6A6458]"
                                        )}
                                    >
                                        <span className={cn("text-sm font-medium", isSelected && "font-bold")}>{opt}</span>
                                        {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="px-3 py-6 text-center text-xs text-[#9A9486] italic">
                                No items found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
