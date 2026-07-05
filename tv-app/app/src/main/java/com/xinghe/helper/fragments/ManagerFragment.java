package com.xinghe.helper.fragments;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.xinghe.helper.R;

import java.util.ArrayList;
import java.util.List;

public class ManagerFragment extends Fragment {

    private RecyclerView recyclerView;
    private LinearLayout emptyLayout;
    private TextView tvAppCount;
    private List<AppInfo> appList = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_manager, container, false);

        recyclerView = view.findViewById(R.id.recyclerView);
        emptyLayout = view.findViewById(R.id.emptyLayout);
        tvAppCount = view.findViewById(R.id.tvAppCount);

        loadApps();
        setupRecyclerView();

        return view;
    }

    private void loadApps() {
        PackageManager pm = requireContext().getPackageManager();
        List<PackageInfo> packages = pm.getInstalledPackages(0);

        String[] mockIcons = {"🥝", "🐱", "🐧", "🥭", "📺", "🍉", "🎵", "⚡", "🛒", "📁", "🌐", "⚙️"};
        String[] mockNames = {"银河奇异果", "CIBN酷喵", "腾讯视频", "芒果TV", "哔哩哔哩", "西瓜视频", "抖音", "快手", "当贝市场", "文件管理器", "浏览器", "设置"};
        String[] mockSizes = {"45.2MB", "52.8MB", "61.5MB", "38.9MB", "58.3MB", "42.1MB", "78.6MB", "65.4MB", "35.7MB", "12.3MB", "28.9MB", "8.5MB"};

        for (int i = 0; i < mockNames.length; i++) {
            AppInfo app = new AppInfo();
            app.name = mockNames[i];
            app.icon = mockIcons[i];
            app.size = mockSizes[i];
            appList.add(app);
        }

        tvAppCount.setText(String.valueOf(appList.size()));
    }

    private void setupRecyclerView() {
        if (appList.isEmpty()) {
            recyclerView.setVisibility(View.GONE);
            emptyLayout.setVisibility(View.VISIBLE);
            return;
        }

        recyclerView.setVisibility(View.VISIBLE);
        emptyLayout.setVisibility(View.GONE);

        GridLayoutManager layoutManager = new GridLayoutManager(getContext(), 6);
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setAdapter(new AppAdapter(getContext(), appList));
    }

    public static class AppInfo {
        String name;
        String icon;
        String size;
    }

    public static class AppAdapter extends RecyclerView.Adapter<AppAdapter.ViewHolder> {

        private Context context;
        private List<AppInfo> apps;

        public AppAdapter(Context context, List<AppInfo> apps) {
            this.context = context;
            this.apps = apps;
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(context).inflate(R.layout.item_app, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            AppInfo app = apps.get(position);
            holder.tvIcon.setText(app.icon);
            holder.tvName.setText(app.name);
            holder.tvSize.setText(app.size);
        }

        @Override
        public int getItemCount() {
            return apps.size();
        }

        public static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvIcon;
            TextView tvName;
            TextView tvSize;

            public ViewHolder(View itemView) {
                super(itemView);
                tvIcon = itemView.findViewById(R.id.tvIcon);
                tvName = itemView.findViewById(R.id.tvName);
                tvSize = itemView.findViewById(R.id.tvSize);
            }
        }
    }
}
