import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Moon, Palette, Sun } from "lucide-react";
import { accentColors } from "../data";
import { SettingsTabProps } from "../types";
import { useTheme } from "@/contexts/ThemeContext";

export function AppearanceTab({ settings, updateSetting }: SettingsTabProps) {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme & Display
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Use dark theme across the application
                </p>
              </div>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact Mode</p>
              <p className="text-sm text-muted-foreground">
                Reduce spacing for more content
              </p>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={(checked) =>
                updateSetting("compactMode", checked)
              }
            />
          </div>
          <Separator />
          {/* <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Animations</p>
              <p className="text-sm text-muted-foreground">
                Enable UI animations and transitions
              </p>
            </div>
            <Switch
              checked={settings.animationsEnabled}
              onCheckedChange={(checked) =>
                updateSetting('animationsEnabled', checked)
              }
            />
          </div> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accent Color</CardTitle>
          <CardDescription>Choose your preferred accent color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {accentColors.map((color, i) => (
              <button
                key={i}
                className={cn(
                  "w-10 h-10 rounded-full transition-all hover:scale-110",
                  color,
                  i === 0 &&
                    "ring-2 ring-offset-2 ring-offset-background ring-primary",
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
