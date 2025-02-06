import { BookText, Brain, Mic } from "lucide-react";

const Banner = () => {
  return (
    <div className="h-full flex-[2] border-r-[0.5px] border-r-border bg-card p-8 hidden lg:flex flex-col justify-center">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xl">N</span>
          </div>
          <h1 className="text-3xl font-bold">Notes</h1>
        </div>

        <h2 className="text-4xl font-bold leading-tight">
          Transform your thoughts into organized notes
        </h2>

        <div className="space-y-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Mic className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Voice Recording</h3>
              <p className="text-muted-foreground">
                Record your thoughts and let AI transcribe them into text
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <BookText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Smart Organization</h3>
              <p className="text-muted-foreground">
                Keep your notes organized with automatic categorization
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
