import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
    AlertCircle,
    ArrowRight,
    BarChart3,
    Calendar,
    ChevronDown,
    Download,
    FileText,
    Layout,
    Loader2,
    PieChart,
    Search,
    X
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { formsApi } from '@/api/forms'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MOCK_ANALYTICS_STATS, MOCK_REPORTS } from '@/lib/mock-data'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export const Route = createFileRoute('/_layout/analytics/reports')({
    component: ReportsPage,
})

function ReportsPage() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [filterDate, setFilterDate] = useState('')
    const [selectedForm, setSelectedForm] = useState('all')
    const [selectedType, setSelectedType] = useState('all')
    const [isGenerating, setIsGenerating] = useState(false)

    // Fetch all forms
    const {
        data: forms,
        isLoading: isFormsLoading,
        error: formsError,
    } = useQuery({
        queryKey: ['forms'],
        queryFn: () => formsApi.getAll(),
    })

    // Filtering logic
    const filteredReports = useMemo(() => {
        return MOCK_REPORTS.filter(rep => {
            const matchesSearch = searchTerm === '' ||
                rep.name.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesDate = filterDate === '' || rep.generatedAt.startsWith(filterDate)
            const matchesForm = selectedForm === 'all' || rep.formId === selectedForm
            const matchesType = selectedType === 'all' || rep.type === selectedType

            return matchesSearch && matchesDate && matchesForm && matchesType
        })
    }, [searchTerm, filterDate, selectedForm, selectedType])

    const handleGenerateReport = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setIsGenerating(false)
            toast({
                title: "Report Generated",
                description: "Your report is ready for download.",
            })
        }, 2000)
    }

    const handleDownload = (format: string, name: string) => {
        toast({
            title: "Downloading...",
            description: `Preparing ${name}.${format.toLowerCase()}`,
        })
        // Simulate download
        const blob = new Blob(["Mock report content"], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${name.replace(/\s+/g, '_').toLowerCase()}.${format.toLowerCase()}`
        link.click()
    }

    if (isFormsLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Loading reports dashboard...</p>
                </div>
            </div>
        )
    }

    if (formsError || !forms) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5">
                        <AlertCircle className="h-7 w-7 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
                    <p className="text-muted-foreground">
                        {formsError ? String(formsError) : 'Failed to load report data'}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto p-6 bg-muted/5">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Form Reports</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Generate and download analytics reports for your forms
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500/10 to-transparent">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Total Reports
                            </CardTitle>
                            <Layout className="h-4 w-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{MOCK_ANALYTICS_STATS.totalReports}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Generated since project start</p>
                        </CardContent>
                    </Card>


                    <Card className="border-none shadow-md bg-gradient-to-br from-emerald-500/10 to-transparent">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Last Generated
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-bold truncate">Today, 4:22 PM</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Quarterly Summary Report</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-amber-500/10 to-transparent">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Export Volume
                            </CardTitle>
                            <Download className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1.2k</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Total downloads recorded</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-12">
                    {/* Generate Report Config */}
                    <Card className="md:col-span-4 border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Generate New Report</CardTitle>
                            <CardDescription>Configure and run a custom analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Select Form</label>
                                <Select value={selectedForm} onValueChange={setSelectedForm}>
                                    <SelectTrigger className="h-10 border-none bg-muted/50">
                                        <SelectValue placeholder="All Forms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Available Forms</SelectItem>
                                        {forms.map(f => (
                                            <SelectItem key={f.id} value={f.id}>{f.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Date Range</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="date"
                                        className="h-10 border-none bg-muted/50 text-xs"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                    />
                                    <Input type="date" className="h-10 border-none bg-muted/50 text-xs" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Report Type</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button
                                        variant={selectedType === 'Summary' ? "secondary" : "outline"}
                                        size="sm"
                                        className={`justify-start gap-2 h-10 border-none bg-muted/50 hover:bg-primary/10 hover:text-primary active:scale-[0.98] ${selectedType === 'Summary' ? 'bg-primary/10 text-primary' : ''}`}
                                        onClick={() => setSelectedType('Summary')}
                                    >
                                        <PieChart className="h-4 w-4" />
                                        Summary Analytics
                                    </Button>
                                    <Button
                                        variant={selectedType === 'Detailed' ? "secondary" : "outline"}
                                        size="sm"
                                        className={`justify-start gap-2 h-10 border-none bg-muted/50 hover:bg-primary/10 hover:text-primary active:scale-[0.98] ${selectedType === 'Detailed' ? 'bg-primary/10 text-primary' : ''}`}
                                        onClick={() => setSelectedType('Detailed')}
                                    >
                                        <FileText className="h-4 w-4" />
                                        Detailed Response List
                                    </Button>
                                    <Button
                                        variant={selectedType === 'Analytics' ? "secondary" : "outline"}
                                        size="sm"
                                        className={`justify-start gap-2 h-10 border-none bg-muted/50 hover:bg-primary/10 hover:text-primary active:scale-[0.98] ${selectedType === 'Analytics' ? 'bg-primary/10 text-primary' : ''}`}
                                        onClick={() => setSelectedType('Analytics')}
                                    >
                                        <BarChart3 className="h-4 w-4" />
                                        User Engagement Metrics
                                    </Button>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 font-bold gap-2 mt-4 shadow-md active:scale-[0.98] transition-transform"
                                onClick={handleGenerateReport}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Layout className="h-4 w-4" />
                                        Generate Report
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Reports History */}
                    <Card className="md:col-span-8 border-none shadow-lg overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg">Recent Reports</CardTitle>
                                    <CardDescription>Download previously generated files</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input
                                            placeholder="Search reports..."
                                            className="h-9 pl-8 text-xs border-none bg-muted/50 w-[180px]"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-muted/50" onClick={() => {
                                        setSearchTerm('');
                                        setFilterDate('');
                                        setSelectedForm('all');
                                        setSelectedType('all');
                                    }}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/30 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-3">Report Name</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Generated</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredReports.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                                                    No reports found matching your filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredReports.map((rep) => (
                                                <tr key={rep.id} className="hover:bg-muted/10 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold flex items-center gap-2 text-primary">
                                                            {rep.name}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                                            From: {rep.formName}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tight">
                                                            {rep.type}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-[10px] font-bold text-muted-foreground">
                                                            {new Date(rep.generatedAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 text-[10px] font-bold gap-1 px-2 hover:bg-primary/10 hover:text-primary"
                                                                onClick={() => handleDownload(rep.format, rep.name)}
                                                            >
                                                                <Download className="h-3 w-3" />
                                                                {rep.format}
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                                <ArrowRight className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {filteredReports.length > 0 && (
                                <div className="p-4 bg-muted/10 border-t flex justify-center">
                                    <Button variant="link" size="sm" className="text-xs font-bold gap-1 opacity-60 hover:opacity-100">
                                        View Complete Audit Trail <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Export All Section */}
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold">Quick Export Data</h3>
                        <p className="text-sm text-muted-foreground">Download all collected responses in your preferred format</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="outline" className="h-11 border-none bg-background shadow-sm hover:bg-green-50 hover:text-green-600 font-bold px-6 gap-2" onClick={() => handleDownload('CSV', 'Master_Export')}>
                            <FileText className="h-4 w-4" />
                            Direct CSV
                        </Button>
                        <Button variant="outline" className="h-11 border-none bg-background shadow-sm hover:bg-blue-50 hover:text-blue-600 font-bold px-6 gap-2" onClick={() => handleDownload('JSON', 'Master_Export')}>
                            <Layout className="h-4 w-4" />
                            Machine JSON
                        </Button>
                        <Button variant="outline" className="h-11 border-none bg-background shadow-sm hover:bg-red-50 hover:text-red-600 font-bold px-6 gap-2" onClick={() => handleDownload('PDF', 'Master_Export')}>
                            <FileText className="h-4 w-4" />
                            Official PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

