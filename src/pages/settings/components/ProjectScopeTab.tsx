import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Clock,
  Users,
  BarChart3,
  Truck,
  CheckCircle,
  Download,
  RefreshCw,
} from 'lucide-react';
import { projectScopeData } from '@/data/projectScope';
import { generateProjectScopeDocument } from '@/utils/generateProjectScopeDoc';
import { generateProjectTasksDocument } from '@/utils/generateProjectTasksDoc';

export function ProjectScopeTab() {
  const [isGeneratingScope, setIsGeneratingScope] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);

  const handleDownloadScope = async () => {
    setIsGeneratingScope(true);
    try {
      await generateProjectScopeDocument();
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGeneratingScope(false);
    }
  };

  const handleDownloadTasks = async () => {
    setIsGeneratingTasks(true);
    try {
      await generateProjectTasksDocument();
    } catch (error) {
      console.error('Error generating tasks document:', error);
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Scope Document
          </CardTitle>
          <CardDescription>
            Complete project specification and technical requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">~17</p>
              <p className="text-xs text-muted-foreground">Weeks Duration</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Team Members</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold">7</p>
              <p className="text-xs text-muted-foreground">Project Phases</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-muted-foreground">User Roles</p>
            </div>
          </div>

          <Separator />

          {/* Scope Preview */}
          <ScrollArea className="h-[500px] border rounded-lg p-6 bg-secondary/10">
            <div className="space-y-8">
              {/* Title */}
              <div className="text-center pb-4 border-b">
                <h2 className="text-2xl font-bold">{projectScopeData.title}</h2>
              </div>

              {/* 1. Project Objectives */}
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    1
                  </span>
                  Project Objectives
                </h3>
                <p className="text-muted-foreground mb-4">
                  {projectScopeData.objectives.main}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border rounded-lg overflow-hidden">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-medium">Goal</th>
                        <th className="text-left p-3 font-medium">Measure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectScopeData.objectives.smart.map((obj, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3">{obj.goal}</td>
                          <td className="p-3 text-muted-foreground">
                            {obj.measure}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 2. Deliverables */}
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    2
                  </span>
                  Deliverables
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Frontend Application</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {projectScopeData.deliverables.frontend.map((item, i) => (
                        <div
                          key={i}
                          className="p-2 bg-secondary/50 rounded text-sm"
                        >
                          <p className="font-medium">{item.module}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Backend Services</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {projectScopeData.deliverables.backend.map((item, i) => (
                        <div
                          key={i}
                          className="p-2 bg-secondary/50 rounded text-sm"
                        >
                          <p className="font-medium">{item.service}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Technical Requirements */}
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    3
                  </span>
                  Technical Requirements
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Frontend Stack</h4>
                    <div className="space-y-1">
                      {projectScopeData.technicalRequirements.frontend.map(
                        (tech, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-sm p-2 bg-secondary/30 rounded"
                          >
                            <span>{tech.technology}</span>
                            <span className="text-muted-foreground">
                              {tech.version}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Backend Stack</h4>
                    <div className="space-y-1">
                      {projectScopeData.technicalRequirements.backend.map(
                        (tech, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-sm p-2 bg-secondary/30 rounded"
                          >
                            <span>{tech.technology}</span>
                            <span className="text-muted-foreground">
                              {tech.version}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. User Roles */}
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    4
                  </span>
                  User Roles
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {projectScopeData.userRoles.map((role, i) => (
                    <div key={i} className="p-3 bg-secondary/30 rounded-lg">
                      <p className="font-medium">{role.role}</p>
                      <p className="text-sm text-muted-foreground">
                        {role.permissions}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Team Composition */}
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    5
                  </span>
                  Team Composition
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border rounded-lg overflow-hidden">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-medium">Role</th>
                        <th className="text-left p-3 font-medium">Level</th>
                        <th className="text-left p-3 font-medium">Work Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectScopeData.teamComposition.map((member, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3">{member.role}</td>
                          <td className="p-3">
                            <Badge
                              variant={
                                member.level === 'Senior'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {member.level}
                            </Badge>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {member.workTime}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 6. Timeline Summary */}
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    6
                  </span>
                  Timeline Summary
                </h3>
                <div className="space-y-2">
                  {projectScopeData.timelineSummary.map((phase, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <span className="font-medium">{phase.phase}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {phase.duration}
                        </span>
                        <Badge variant="outline">{phase.cumulative}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
                  <p className="text-lg font-bold">
                    Total Duration: ~17 weeks (~4 months)
                  </p>
                </div>
              </section>

              {/* 7. Next Steps */}
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                    7
                  </span>
                  Next Steps
                </h3>
                <div className="space-y-2">
                  {projectScopeData.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <Clock className="h-5 w-5 text-warning" />
                      )}
                      <span
                        className={step.completed ? 'text-muted-foreground' : ''}
                      >
                        {step.step}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </ScrollArea>

          <Separator />

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDownloadScope}
              variant="gradient"
              className="flex-1"
              disabled={isGeneratingScope}
            >
              {isGeneratingScope ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Scope Document
                </>
              )}
            </Button>
            <Button
              onClick={handleDownloadTasks}
              variant="outline"
              className="flex-1"
              disabled={isGeneratingTasks}
            >
              {isGeneratingTasks ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Epics & Tasks
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
