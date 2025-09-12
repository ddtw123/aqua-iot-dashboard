"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIInsight } from "@/types/aiInsights";
import { fadeInYEnd, fadeInYInitial, fadeTransition } from "@/util/constant";
import { motion } from "framer-motion";
import { AlertTriangle, Brain, Lightbulb, RefreshCw, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function AIInsightsPanel({ deviceId }: { deviceId: string }) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t, i18n } = useTranslation();

  const fetchInsights = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/ai-insights?device_id=${deviceId}&limit=1&refresh=${forceRefresh}&language=${i18n.language}`);
      const result = await response.json();
      setInsights(result.data || []);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, i18n.language]);

  const refreshInsights = async () => {
    setIsRefreshing(true);
    await fetchInsights(true);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchInsights(false);
  }, [fetchInsights]);

  // Helper function to get localized content
  const getLocalizedContent = (insight: AIInsight, field: 'title' | 'description' | 'ai_summary' | 'recommendations') => {
    const currentLanguage = i18n.language;
    const translation = insight.translations?.[currentLanguage];
    
    if (translation && translation[field]) {
      return translation[field];
    }
    
    return insight[field];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return AlertTriangle;
      case 'forecast': return TrendingUp;
      case 'summary': return Brain;
      case 'recommendation': return Lightbulb;
      default: return Brain;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-dark_blue border-slate-200 dark:border-border_blue duration-300 rounded-none">
        <CardHeader>
          <CardTitle className="text-h5SM md:text-h4MD text-black dark:text-white duration-300 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t("ai_insights.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">{t("ai_insights.analyzing")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={fadeInYInitial}
      whileInView={fadeInYEnd}
      transition={fadeTransition}
      viewport={{ once: true }}
      className="w-full"
    >
      <Card className="bg-white dark:bg-dark_blue border-slate-200 dark:border-border_blue duration-300 rounded-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-h5SM md:text-h4MD text-black dark:text-white duration-300 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {t("ai_insights.title")}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshInsights}
              disabled={isRefreshing}
              className="h-8 px-3 text-xs"
              title="Generate new AI insights now (bypasses 24-hour limit)"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? t("ai_insights.generating") : t("ai_insights.refresh")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">{t("ai_insights.noInsights")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const IconComponent = getInsightIcon(insight.insight_type);
                return (
                  <motion.div
                    key={`${insight.device_id}-${insight.timestamp}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-slate-200 dark:border-border_blue rounded-lg p-4 bg-slate-50 dark:bg-slate-800"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-sm text-black dark:text-white">
                          {getLocalizedContent(insight, 'title')}
                        </h4>
                      </div>
                      <Badge className={getSeverityColor(insight.severity)}>
                        {t(`ai_insights.severity.${insight.severity}`)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {getLocalizedContent(insight, 'description')}
                    </p>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                        {t("ai_insights.aiAnalysis")}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {getLocalizedContent(insight, 'ai_summary')}
                      </p>
                    </div>
                    
                    {insight.affected_metrics.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">{t("ai_insights.affectedMetrics")}</p>
                        <div className="flex flex-wrap gap-1">
                          {insight.affected_metrics.map((metric) => (
                            <Badge key={metric} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {insight.recommendations && insight.recommendations.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t("ai_insights.recommendations")}</p>
                        <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                          {(getLocalizedContent(insight, 'recommendations') as string[] || insight.recommendations).map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 dark:border-border_blue">
                      <span className="text-xs text-gray-400">
                        {t("ai_insights.confidence")} {Math.round(insight.confidence_score * 100)}%
                      </span>
                      <div className="text-xs text-gray-400 text-right">
                        <div>{t("ai_insights.generated")} {new Date(insight.created_at).toLocaleString()}</div>
                        <div className="text-blue-500">
                          {t("ai_insights.nextUpdate")} {new Date(new Date(insight.created_at).getTime() + 24 * 60 * 60 * 1000).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}