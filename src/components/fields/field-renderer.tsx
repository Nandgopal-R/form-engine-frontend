import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import * as Validation from "@/lib/validation"
import { Country, State, City } from 'country-state-city'
import { SearchableSelect } from "./searchable-select"
import type { CanvasField } from "./field-preview"

interface FieldRendererProps {
    field: CanvasField
    value: any
    onChange: (value: any) => void
    formData?: Record<string, any>
    error?: string | null
    onValidationError?: (error: string | null) => void
}

export function FieldRenderer({ field, value, onChange, formData, error: propError, onValidationError }: FieldRendererProps) {
    const [localValue, setLocalValue] = useState(value ?? (['checkbox-group', 'multi-select'].includes(field.type) ? [] : ""))
    const [localError, setLocalError] = useState<string | null>(null)

    // Keep local value in sync with external value transitionally
    useEffect(() => {
        if (value !== undefined && value !== localValue) {
            setLocalValue(value ?? (['checkbox-group', 'multi-select'].includes(field.type) ? [] : ""))
        }
    }, [value, localValue, field.type])

    const validate = (val: any) => {
        let err: string | null = null

        if (field.required && (!val || (Array.isArray(val) && val.length === 0))) {
            err = "This field is required"
        } else {
            switch (field.type) {
                case "email":
                    err = Validation.validateEmail(val)
                    break
                case "url":
                    err = Validation.validateURL(val)
                    break
                case "phone":
                    err = Validation.validatePhone(val)
                    break
                case "password":
                    err = Validation.validatePassword(val)
                    break
                case "percent":
                    err = Validation.validatePercentage(val)
                    break
            }
        }
        setLocalError(err)
        onValidationError?.(err)
    }

    const handleBlur = () => {
        validate(localValue)
    }

    const handleChange = (val: any) => {
        setLocalValue(val)
        onChange(val)
        // Clear error as user types, or re-validate if it was already showing
        if (localError) validate(val)
    }

    const renderInput = () => {
        switch (field.type) {
            case "textarea":
                return (
                    <Textarea
                        placeholder={field.placeholder}
                        value={localValue}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        className={cn("bg-white", localError && "border-red-500")}
                    />
                )
            case "checkbox":
                return (
                    <div className="space-y-2 p-1">
                        {(field.options || ["Option 1", "Option 2"]).map((opt, i) => {
                            const isSelected = localValue === opt
                            return (
                                <div
                                    key={i}
                                    className="flex items-center space-x-2 cursor-pointer group"
                                    onClick={() => handleChange(isSelected ? "" : opt)}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                                        isSelected ? "border-[#E89E45] bg-[#E89E45]" : "border-[#D0C9BA] bg-white group-hover:border-[#BBB5A5]"
                                    )}>
                                        {isSelected && (
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <Label className="text-sm font-normal text-[#6A6458] cursor-pointer">{opt}</Label>
                                </div>
                            )
                        })}
                    </div>
                )
            case "checkbox-group":
                return (
                    <div className="space-y-2 p-1">
                        {(field.options || ["Option 1", "Option 2"]).map((opt, i) => {
                            const isGroupSelected = (localValue || []).includes(opt)
                            return (
                                <div
                                    key={i}
                                    className="flex items-center space-x-2 cursor-pointer group"
                                    onClick={() => {
                                        const newVal = isGroupSelected
                                            ? (localValue || []).filter((v: string) => v !== opt)
                                            : [...(localValue || []), opt]
                                        handleChange(newVal)
                                    }}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                                        isGroupSelected ? "border-[#E89E45] bg-[#E89E45]" : "border-[#D0C9BA] bg-white group-hover:border-[#BBB5A5]"
                                    )}>
                                        {isGroupSelected && (
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <Label className="text-sm font-normal text-[#6A6458] cursor-pointer">{opt}</Label>
                                </div>
                            )
                        })}
                    </div>
                )
            case "radio":
                return (
                    <div className="space-y-2 p-1">
                        {(field.options || ["Option 1", "Option 2"]).map((opt, i) => (
                            <div key={i} className="flex items-center space-x-2 cursor-pointer group" onClick={() => handleChange(opt)}>
                                <div className={cn(
                                    "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                                    localValue === opt ? "border-[#E89E45] bg-[#E89E45]" : "border-[#D0C9BA] bg-white group-hover:border-[#BBB5A5]"
                                )}>
                                    {localValue === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <Label className="text-sm font-normal text-[#6A6458] cursor-pointer">{opt}</Label>
                            </div>
                        ))}
                    </div>
                )
            case "dropdown":
            case "multi-select":
                return (
                    <SearchableSelect
                        options={(field.options || ["Option 1", "Option 2", "Option 3"]).sort((a, b) => a.localeCompare(b))}
                        value={localValue}
                        onChange={handleChange}
                        placeholder={field.placeholder || "Select an option..."}
                        isMulti={field.type === "multi-select"}
                        error={!!localError}
                    />
                )
            case "date":
                return (
                    <Input
                        type="date"
                        value={localValue}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        className={cn("bg-white", localError && "border-red-500")}
                    />
                )
            case "time":
            case "datetime":
                const isDateTime = field.type === "datetime"
                // Value format: "YYYY-MM-DD HH:MM AM/PM" or just "HH:MM AM/PM"
                const fullValue = localValue || (isDateTime ? `${new Date().toISOString().split('T')[0]} 12:00 PM` : "12:00 PM")

                const datePart = isDateTime ? fullValue.split(" ")[0] : ""
                const timeStr = isDateTime ? fullValue.split(" ").slice(1).join(" ") : fullValue

                const [timePart, meridiem] = (timeStr || "12:00 PM").split(" ")
                const [hour, minute] = (timePart || "12:00").split(":")

                const updateTime = (h: string, m: string, mer: string, d?: string) => {
                    const timeVal = `${h}:${m} ${mer}`
                    const newVal = isDateTime ? `${d || datePart} ${timeVal}` : timeVal
                    handleChange(newVal)
                }

                return (
                    <div className={cn("space-y-2", isDateTime && "bg-[#F5F2EA]/20 p-3 rounded-2xl border border-[#E5E1D8]/30")}>
                        {isDateTime && (
                            <Input
                                type="date"
                                value={datePart}
                                onChange={(e) => updateTime(hour, minute, meridiem, e.target.value)}
                                className="bg-white border-[#E5E1D8] mb-2"
                            />
                        )}
                        <div className="flex items-center gap-2 bg-white border border-[#E5E1D8] rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#D0C9BA]/30 focus-within:border-[#D0C9BA] transition-all">
                            <select
                                value={hour}
                                onChange={(e) => updateTime(e.target.value, minute, meridiem)}
                                className="bg-transparent text-sm focus:outline-none cursor-pointer"
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                    <option key={h} value={String(h).padStart(2, '0')}>{h}</option>
                                ))}
                            </select>
                            <span className="text-[#9A9486] font-bold">:</span>
                            <select
                                value={minute}
                                onChange={(e) => updateTime(hour, e.target.value, meridiem)}
                                className="bg-transparent text-sm focus:outline-none cursor-pointer"
                            >
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                                    <option key={m} value={String(m).padStart(2, '0')}>{String(m).padStart(2, '0')}</option>
                                ))}
                            </select>
                            <div className="w-px h-4 bg-[#E5E1D8] mx-1" />
                            <select
                                value={meridiem}
                                onChange={(e) => updateTime(hour, minute, e.target.value)}
                                className="bg-transparent text-sm font-bold text-[#E89E45] focus:outline-none cursor-pointer"
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    </div>
                )
            case "file":
            case "image":
                return (
                    <div className="space-y-2">
                        <Input
                            type="file"
                            accept={field.type === "image" ? "image/png, image/jpeg, image/webp" : "*"}
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    // Size Check
                                    const sizeErr = Validation.validateFileSize(file.size, 5)
                                    if (sizeErr) {
                                        setLocalError(sizeErr)
                                        return
                                    }
                                    handleChange(file.name)
                                }
                            }}
                            className={cn("bg-white cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F5F2EA] file:text-[#8A8476] hover:file:bg-[#E5E1D8]", localError && "border-red-500")}
                        />
                        <p className="text-[10px] text-[#9A9486]">Max 5MB • {field.type === 'image' ? 'Images only' : 'Any file'}</p>
                    </div>
                )
            case "switch":
                return (
                    <div className="flex items-center space-x-2 p-2">
                        <div
                            className={cn(
                                "w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer",
                                localValue ? "bg-[#E89E45]" : "bg-[#D0C9BA]"
                            )}
                            onClick={() => handleChange(!localValue)}
                        >
                            <div className={cn("bg-white w-4 h-4 rounded-full shadow-sm transition-transform", localValue && "translate-x-4")} />
                        </div>
                        <Label className="text-sm font-normal text-[#6A6458]">{field.placeholder || "Enable feature"}</Label>
                    </div>
                )
            case "slider":
                return (
                    <div className="space-y-4 pt-2">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={localValue || 50}
                            onChange={(e) => handleChange(e.target.value)}
                            className="w-full accent-[#E89E45] h-1.5 bg-[#F5F2EA] rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-[#BBB5A5]">
                            <span>0</span>
                            <span className="text-[#4A4538] bg-[#F5F2EA] px-2 py-0.5 rounded-md">{localValue || 50}%</span>
                            <span>100</span>
                        </div>
                    </div>
                )
            case "rating":
                return (
                    <div className="flex items-center gap-1.5 p-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div
                                key={s}
                                onClick={() => handleChange(s)}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer",
                                    (localValue || 0) >= s ? "bg-[#FDFBF7] text-[#E89E45] shadow-sm border-[#E89E45]/20" : "bg-white text-[#D0C9BA] border border-transparent hover:bg-[#FDFBF7]"
                                )}
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                            </div>
                        ))}
                    </div>
                )
            case "currency":
            case "percent":
                const isPercent = field.type === "percent"
                return (
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9486] font-medium pointer-events-none">
                            {isPercent ? "" : "$"}
                        </div>
                        <Input
                            type="number"
                            placeholder={field.placeholder || (isPercent ? "0.00" : "0.00")}
                            value={localValue}
                            onChange={(e) => handleChange(e.target.value)}
                            onBlur={handleBlur}
                            className={cn(
                                "bg-white border-[#E5E1D8] focus:border-[#D0C9BA] focus:ring-[#D0C9BA]/30 rounded-xl h-11",
                                isPercent ? "pr-8" : "pl-8",
                                localError && "border-red-500"
                            )}
                        />
                        {isPercent && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9486] font-medium pointer-events-none">
                                %
                            </div>
                        )}
                    </div>
                )
            case "country":
            case "state":
            case "city":
                const selectedCountryName = formData?.country
                const selectedStateName = formData?.state

                let options: string[] = []
                if (field.type === "country") {
                    options = Country.getAllCountries().map(c => c.name)
                } else if (field.type === "state" && selectedCountryName) {
                    const country = Country.getAllCountries().find(c => c.name === selectedCountryName)
                    options = country ? State.getStatesOfCountry(country.isoCode).map(s => s.name) : []
                } else if (field.type === "city" && selectedCountryName && selectedStateName) {
                    const country = Country.getAllCountries().find(c => c.name === selectedCountryName)
                    if (country) {
                        const state = State.getStatesOfCountry(country.isoCode).find(s => s.name === selectedStateName)
                        options = state ? City.getCitiesOfState(country.isoCode, state.isoCode).map(c => c.name) : []
                    }
                }

                // Sort options alphabetically
                options.sort((a, b) => a.localeCompare(b))

                const isLocationDisabled = (field.type === "state" && !selectedCountryName) || (field.type === "city" && !selectedStateName)

                return (
                    <div className="space-y-1.5 w-full">
                        <SearchableSelect
                            options={options}
                            value={localValue}
                            onChange={handleChange}
                            placeholder={field.placeholder || `Select ${field.type}...`}
                            disabled={isLocationDisabled}
                            error={!!localError}
                        />
                        {field.type !== 'country' && isLocationDisabled && (
                            <p className="text-[10px] text-amber-600 font-medium italic">
                                Please select a {field.type === 'state' ? 'country' : 'state'} first
                            </p>
                        )}
                    </div>
                )
            case "address":
                return (
                    <Textarea
                        placeholder={field.placeholder || "Enter full address..."}
                        value={localValue}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        className={cn("bg-white border-[#E5E1D8] focus:border-[#D0C9BA] rounded-xl min-h-[80px]", localError && "border-red-500")}
                    />
                )
            case "zip":
                return (
                    <Input
                        type="text"
                        placeholder={field.placeholder || "Enter zip code..."}
                        value={localValue}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                            handleChange(val)
                        }}
                        onBlur={handleBlur}
                        className={cn("bg-white border-[#E5E1D8] focus:border-[#D0C9BA] rounded-xl h-11", localError && "border-red-500")}
                    />
                )
            case "payment":
                return (
                    <div className="space-y-3 p-4 bg-[#F5F2EA]/30 rounded-2xl border border-[#E5E1D8]/50">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#9A9486] uppercase tracking-widest">Secure Checkout</span>
                            <div className="flex gap-1">
                                <div className="w-6 h-4 bg-white border border-[#E5E1D8] rounded-[2px]" />
                                <div className="w-6 h-4 bg-white border border-[#E5E1D8] rounded-[2px]" />
                            </div>
                        </div>
                        <Input
                            placeholder="Card Number"
                            disabled
                            className="bg-white border-[#E5E1D8] rounded-xl h-10 text-xs"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="MM/YY" disabled className="bg-white border-[#E5E1D8] rounded-xl h-10 text-xs" />
                            <Input placeholder="CVC" disabled className="bg-white border-[#E5E1D8] rounded-xl h-10 text-xs" />
                        </div>
                    </div>
                )
            default:
                return (
                    <Input
                        type={field.type === "password" ? "password" : field.type === "number" ? "number" : "text"}
                        placeholder={field.placeholder}
                        value={localValue}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        maxLength={field.type === "password" ? 10 : undefined}
                        className={cn("bg-white", localError && "border-red-500")}
                    />
                )
        }
    }

    return (
        <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-[#4A4538] flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
            </Label>

            {renderInput()}

            {(localError || propError) && (
                <p className="text-[11px] font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                    {localError || propError}
                </p>
            )}
        </div>
    )
}
